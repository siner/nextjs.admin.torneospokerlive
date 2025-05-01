"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server"; // Asegúrate que la ruta es correcta
import { blogCategorySchema } from "@/lib/schemas";
import { z } from "zod";

export type BlogCategoryState = {
  errors?: {
    name?: string[];
    slug?: string[];
    db?: string[]; // Para errores generales de base de datos
  };
  message?: string | null;
};

// --- UPSERT ACTION ---
export async function upsertBlogCategoryAction(
  prevState: BlogCategoryState,
  formData: FormData
): Promise<BlogCategoryState> {
  const supabase = createClient();

  // *** Inicio: Verificar usuario autenticado ***
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Usuario intentando upsert categoría:", user?.id, user?.email);
  if (!user) {
    console.error(
      "¡Error crítico: No se encontró usuario autenticado en la acción!"
    );
    return {
      errors: { db: ["Operación fallida: Usuario no autenticado."] },
      message: "Error de autenticación.",
    };
  }
  // *** Fin: Verificar usuario autenticado ***

  // Validar FormData usando Zod
  const validatedFields = blogCategorySchema.safeParse({
    id: formData.get("id") || undefined, // Obtener id si existe para update
    name: formData.get("name"),
    slug: formData.get("slug"),
    // Aquí podrías añadir lógica para generar el slug si no se provee
    // const generatedSlug = formData.get("slug") || slugify(formData.get("name") as string);
    // slug: generatedSlug,
  });

  // Si la validación falla, retornar errores
  if (!validatedFields.success) {
    console.error(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrige los campos.",
    };
  }

  const { id, ...categoryData } = validatedFields.data;

  try {
    const { error } = await supabase
      .from("blog_categories")
      .upsert(
        id ? { ...categoryData, id } : categoryData // Si hay id, es update, si no, insert
      )
      .select("id") // Seleccionar algo para verificar el éxito
      .single(); // .single() es importante para que falle si no inserta/actualiza una fila

    if (error) {
      console.error("Supabase Upsert Error:", error);
      // Revisar errores comunes como unique constraint
      if (error.code === "23505") {
        // Código para unique violation
        return {
          errors: {
            slug: ["El slug ya existe. Por favor, elige otro."],
            // O podría ser 'name' si el unique constraint está en el nombre
          },
          message: "Error al guardar la categoría.",
        };
      }
      return {
        errors: { db: ["Error al guardar la categoría en la base de datos."] },
        message: "Error de base de datos.",
      };
    }

    // Revalidar la ruta del listado de categorías
    revalidatePath("/dashboard/blog/categorias");

    return {
      message: `Categoría ${id ? "actualizada" : "creada"} correctamente.`,
    };
  } catch (e) {
    console.error("General Upsert Error:", e);
    return {
      errors: { db: ["Ocurrió un error inesperado."] },
      message: "Error inesperado.",
    };
  }
}

// --- DELETE ACTION ---
export async function deleteBlogCategoryAction(
  id: string // Recibimos el ID directamente
): Promise<{ message: string; success: boolean }> {
  // Validar que el ID sea un UUID válido (opcional pero recomendado)
  const uuidSchema = z.string().uuid({ message: "ID de categoría inválido." });
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    return {
      message: validation.error.flatten().formErrors.join(", "),
      success: false,
    };
  }

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("blog_categories")
      .delete()
      .match({ id });

    if (error) {
      console.error("Supabase Delete Error:", error);
      return { message: "Error al eliminar la categoría.", success: false };
    }

    // Revalidar la ruta
    revalidatePath("/dashboard/blog/categorias");

    return { message: "Categoría eliminada correctamente.", success: true };
  } catch (e) {
    console.error("General Delete Error:", e);
    return { message: "Error inesperado al eliminar.", success: false };
  }
}
