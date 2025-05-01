"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// --- DELETE ACTION (Comments) ---
export async function deleteBlogCommentAction(
  id: string // UUID del comentario
): Promise<{ message: string; success: boolean }> {
  // Validar que el ID sea un UUID válido
  const uuidSchema = z.string().uuid({ message: "ID de comentario inválido." });
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    console.error("Invalid comment ID for deletion:", id);
    return {
      message: validation.error.flatten().formErrors.join(", "),
      success: false,
    };
  }

  const supabase = createClient();

  // Verificar usuario autenticado (podríamos añadir check de rol si es necesario)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Usuario no autenticado.", success: false };
  }

  console.log(`User ${user.id} attempting to delete comment ${id}`);

  try {
    const { error } = await supabase
      .from("blog_comments") // Asegúrate que el nombre de la tabla es correcto
      .delete()
      .match({ id });

    if (error) {
      console.error("Supabase Delete Error (Comments):", error);
      return {
        message: `Error al eliminar el comentario: ${error.message}`,
        success: false,
      };
    }

    // Revalidar las rutas donde podrían mostrarse comentarios
    // Es difícil saber la ruta exacta del post aquí, revalidamos rutas generales
    revalidatePath("/dashboard/blog/posts");
    // Podrías necesitar revalidar la página de edición específica si muestras comentarios ahí
    // revalidatePath(`/dashboard/blog/posts/edit/[id]`, 'layout'); // O 'page'

    return { message: "Comentario eliminado correctamente.", success: true };
  } catch (e: unknown) {
    console.error("General Delete Error (Comments):", e);
    const message =
      e instanceof Error ? e.message : "Error inesperado al eliminar.";
    return { message, success: false };
  }
}
