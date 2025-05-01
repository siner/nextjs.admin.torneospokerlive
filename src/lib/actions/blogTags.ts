"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { blogTagSchema } from "@/lib/schemas"; // Usar el schema correcto
import { z } from "zod";

// Estado para el formulario de Tags
export type BlogTagState = {
  errors?: {
    name?: string[];
    slug?: string[];
    db?: string[];
  };
  message?: string | null;
};

const initialState: BlogTagState = { message: null, errors: {} };

// --- UPSERT ACTION (Tags) ---
export async function upsertBlogTagAction(
  prevState: BlogTagState,
  formData: FormData
): Promise<BlogTagState> {
  const supabase = createClient();

  // Verificar usuario autenticado (buena práctica mantenerlo)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Usuario intentando upsert tag:", user?.id, user?.email);
  if (!user) {
    return {
      errors: { db: ["Operación fallida: Usuario no autenticado."] },
      message: "Error de autenticación.",
    };
  }

  // Validar FormData usando Zod
  const validatedFields = blogTagSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    // Podríamos añadir slugify aquí también
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Errors (Tags):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrige los campos.",
    };
  }

  const { id, ...tagData } = validatedFields.data;

  try {
    const { error } = await supabase
      .from("blog_tags") // Cambiar a la tabla correcta
      .upsert(id ? { ...tagData, id } : tagData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase Upsert Error (Tags):", error);
      if (error.code === "23505") {
        return {
          errors: { slug: ["El slug ya existe. Por favor, elige otro."] },
          message: "Error al guardar el tag.",
        };
      }
      // Incluir el mensaje de error específico de Supabase puede ser útil
      return {
        errors: { db: [`Error al guardar el tag: ${error.message}`] },
        message: "Error de base de datos.",
      };
    }

    // Revalidar la ruta del listado de tags
    revalidatePath("/dashboard/blog/tags");

    return { message: `Tag ${id ? "actualizado" : "creado"} correctamente.` };
  } catch (e: unknown) {
    // Tipar error como unknown
    console.error("General Upsert Error (Tags):", e);
    const message =
      e instanceof Error ? e.message : "Ocurrió un error inesperado.";
    return {
      errors: { db: [message] },
      message: "Error inesperado.",
    };
  }
}

// --- DELETE ACTION (Tags) ---
export async function deleteBlogTagAction(
  id: string // Recibimos el ID (UUID)
): Promise<{ message: string; success: boolean }> {
  const uuidSchema = z.string().uuid({ message: "ID de tag inválido." });
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
  console.log("Usuario intentando eliminar tag:", id, " Usuario:", user?.id);
  if (!user) {
    return {
      message: "Operación fallida: Usuario no autenticado.",
      success: false,
    };
  }

  try {
    const { error } = await supabase
      .from("blog_tags") // Cambiar a la tabla correcta
      .delete()
      .match({ id });

    if (error) {
      console.error("Supabase Delete Error (Tags):", error);
      // Incluir mensaje de error
      return {
        message: `Error al eliminar el tag: ${error.message}`,
        success: false,
      };
    }

    // Revalidar la ruta
    revalidatePath("/dashboard/blog/tags");

    return { message: "Tag eliminado correctamente.", success: true };
  } catch (e: unknown) {
    console.error("General Delete Error (Tags):", e);
    const message =
      e instanceof Error ? e.message : "Error inesperado al eliminar.";
    return { message, success: false };
  }
}
