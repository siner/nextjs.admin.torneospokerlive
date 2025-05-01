"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/schemas";
import { z } from "zod";
import { PostgrestError } from "@supabase/supabase-js"; // Importar para tipado de errores

// Estado para el formulario de Posts
export type BlogPostState = {
  errors?: {
    title?: string[];
    slug?: string[];
    content?: string[];
    category_id?: string[];
    tags?: string[];
    featured_image_url?: string[];
    status?: string[];
    published_at?: string[];
    db?: string[]; // Errores generales o de relaciones
  };
  message?: string | null;
};

const initialState: BlogPostState = { message: null, errors: {} };

// --- UPSERT ACTION (Posts) ---
export async function upsertBlogPostAction(
  prevState: BlogPostState,
  formData: FormData
): Promise<BlogPostState> {
  const supabase = createClient();

  // 1. Verificar usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      errors: { db: ["Usuario no autenticado."] },
      message: "Error de autenticación.",
    };
  }
  const author_id = user.id;

  // 2. Validar FormData principal
  // Convertir tags a array antes de validar
  const tagsFromData = formData
    .getAll("tags")
    .filter((tag) => typeof tag === "string" && tag !== "");

  const validatedFields = blogPostSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"), // Podríamos añadir slugify aquí
    content: formData.get("content"),
    category_id: formData.get("category_id") || null,
    tags: tagsFromData, // Pasar el array procesado
    featured_image_url: formData.get("featured_image_url") || null,
    status: formData.get("status"),
    published_at: formData.get("published_at") || null,
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Errors (Posts):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrige los campos.",
    };
  }

  const { id, tags: tagIds, ...postData } = validatedFields.data;
  let postId = id; // Guardamos el ID si es una actualización

  try {
    // 3. Upsert en la tabla blog_posts
    const { data: upsertedPost, error: postError } = await supabase
      .from("blog_posts")
      .upsert(
        id
          ? { ...postData, id, author_id } // Update (author_id normalmente no cambia, pero se incluye por si acaso)
          : { ...postData, author_id } // Insert
      )
      .select("id") // Necesitamos el ID para la relación de tags
      .single();

    if (postError || !upsertedPost) {
      console.error("Supabase Upsert Error (Posts):", postError);
      if (postError?.code === "23505") {
        return {
          errors: { slug: ["El slug ya existe. Por favor, elige otro."] },
          message: "Error al guardar el post.",
        };
      }
      return {
        errors: { db: [`Error al guardar el post: ${postError?.message}`] },
        message: "Error de base de datos.",
      };
    }

    // Si era una inserción, obtenemos el nuevo ID
    if (!postId) {
      postId = upsertedPost.id;
    }

    // 4. Gestionar relación con Tags en blog_post_tags
    // 4.1. Borrar relaciones existentes para este post
    const { error: deleteTagsError } = await supabase
      .from("blog_post_tags")
      .delete()
      .match({ post_id: postId });

    if (deleteTagsError) {
      console.error("Error deleting old tags:", deleteTagsError);
      // Podríamos intentar continuar, pero es más seguro devolver error
      return {
        errors: {
          db: [`Error al actualizar tags (delete): ${deleteTagsError.message}`],
        },
        message: "Error gestionando etiquetas.",
      };
    }

    // 4.2. Insertar nuevas relaciones si se proporcionaron tags
    if (tagIds && tagIds.length > 0) {
      const newPostTags = tagIds.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      }));

      const { error: insertTagsError } = await supabase
        .from("blog_post_tags")
        .insert(newPostTags);

      if (insertTagsError) {
        console.error("Error inserting new tags:", insertTagsError);
        return {
          errors: {
            db: [
              `Error al actualizar tags (insert): ${insertTagsError.message}`,
            ],
          },
          message: "Error gestionando etiquetas.",
        };
      }
    }

    // 5. Revalidar rutas
    revalidatePath("/dashboard/blog/posts");
    // Opcional: revalidar ruta pública del post si existe
    // revalidatePath(`/blog/${postData.slug}`);

    return { message: `Post ${id ? "actualizado" : "creado"} correctamente.` };
  } catch (e: unknown) {
    console.error("General Upsert Error (Posts):", e);
    const message =
      e instanceof Error ? e.message : "Ocurrió un error inesperado.";
    return {
      errors: { db: [message] },
      message: "Error inesperado.",
    };
  }
}

// --- DELETE ACTION (Posts) ---
export async function deleteBlogPostAction(
  id: string // UUID del post
): Promise<{ message: string; success: boolean }> {
  const uuidSchema = z.string().uuid({ message: "ID de post inválido." });
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    return {
      message: validation.error.flatten().formErrors.join(", "),
      success: false,
    };
  }

  const supabase = createClient();

  // Verificar usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Usuario no autenticado.", success: false };
  }

  try {
    const { error } = await supabase.from("blog_posts").delete().match({ id });

    if (error) {
      console.error("Supabase Delete Error (Posts):", error);
      return {
        message: `Error al eliminar el post: ${error.message}`,
        success: false,
      };
    }

    // Revalidar ruta principal del blog
    revalidatePath("/dashboard/blog/posts");
    // Quizás revalidar ruta pública también

    return { message: "Post eliminado correctamente.", success: true };
  } catch (e: unknown) {
    console.error("General Delete Error (Posts):", e);
    const message =
      e instanceof Error ? e.message : "Error inesperado al eliminar.";
    return { message, success: false };
  }
}
