"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { casinoSchema } from "@/lib/schemas"; // Importar el schema correcto
import { revalidatePath } from "next/cache";

// Definir el tipo para el estado que devolverá la acción
export type CasinoActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[] | null;
};

export async function upsertCasinoAction(
  prevState: CasinoActionState,
  formData: FormData
): Promise<CasinoActionState> {
  const supabase = createClient();

  // 1. Convertir FormData a objeto
  const formValues = Object.fromEntries(formData.entries());

  // Preparar objeto para Zod
  const objectToValidate = {
    ...formValues,
    id: formValues.id ? Number(formValues.id) : undefined,
    // Asegurarse de que los campos string sean strings
    name: formValues.name,
    slug: formValues.slug,
    logo: formValues.logo,
    color: formValues.color,
    content: formValues.content,
  };

  // 2. Validar con Zod
  const validatedFields = casinoSchema.safeParse(objectToValidate);

  // 3. Manejar errores de validación
  if (!validatedFields.success) {
    console.error(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Error de validación. Revisa los campos marcados.",
      errors: validatedFields.error.issues,
    };
  }

  // 4. Preparar datos para Supabase (aquí coinciden con validatedFields.data)
  const dataToUpsert = validatedFields.data;

  const casinoId = dataToUpsert.id;
  if (!casinoId) {
    delete dataToUpsert.id; // No pasar ID en la inserción
  }

  // 5. Realizar operación en Supabase
  try {
    let supabaseError;
    if (casinoId) {
      // UPDATE
      console.log("Attempting to update casino:", casinoId, dataToUpsert);
      const { error } = await supabase
        .from("Casino")
        .update(dataToUpsert)
        .eq("id", casinoId);
      supabaseError = error;
    } else {
      // INSERT
      console.log("Attempting to insert casino:", dataToUpsert);
      const { error } = await supabase.from("Casino").insert(dataToUpsert);
      supabaseError = error;
    }

    // 6. Manejar errores de Supabase
    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      // Comprobar error específico de slug duplicado (23505 unique constraint)
      if (
        supabaseError.code === "23505" &&
        supabaseError.message.includes("Casino_slug_key")
      ) {
        return {
          success: false,
          message: "Error: El slug ya existe. Por favor, elige otro.",
          errors: null,
        };
      }
      return {
        success: false,
        message: `Error al guardar en la base de datos: ${supabaseError.message}`,
        errors: null,
      };
    }

    // 7. Revalidar caché y devolver éxito
    revalidatePath("/dashboard/casinos"); // Revalidar la lista de casinos

    const successMessage = casinoId
      ? "Casino actualizado con éxito."
      : "Casino creado con éxito.";

    // No redirigimos desde aquí, se maneja en cliente si es necesario

    return {
      success: true,
      message: successMessage,
      errors: null,
    };
  } catch (error) {
    console.error("Unexpected Error:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado.",
      errors: null,
    };
  }
}
