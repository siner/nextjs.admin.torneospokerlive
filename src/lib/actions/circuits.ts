"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { circuitSchema, CircuitSchema } from "@/lib/schemas";
import { z } from "zod"; // Importar z para ZodIssue

// Definición local de ActionResult adaptada
export type ActionResult<T> = {
  status: "success" | "error" | "idle";
  message: string;
  data?: T;
  errors?: z.ZodIssue[] | null;
};

// No se necesita el tipo Circuit de database.types

export async function upsertCircuitAction(
  // Usar CircuitSchema como tipo de dato en el estado
  state: ActionResult<CircuitSchema>,
  formData: FormData
): Promise<ActionResult<CircuitSchema>> {
  const supabase = createClient();

  // 1. Convertir FormData a objeto plano
  const formValues = Object.fromEntries(formData.entries());

  // Preparar objeto para Zod, incluyendo conversión de ID
  const objectToValidate = {
    ...formValues,
    id:
      formValues.id && formValues.id !== "undefined" && formValues.id !== ""
        ? Number(formValues.id)
        : undefined,
    name: formValues.name as string,
    slug: formValues.slug as string,
    // logoUrl ya es string o undefined
    logoUrl: formValues.logoUrl as string | undefined,
  };

  // 2. Validar con Zod
  const validatedFields = circuitSchema.safeParse(objectToValidate);

  if (!validatedFields.success) {
    console.error(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      status: "error",
      message: "Error de validación. Revisa los campos.",
      // Devolver ZodIssue[]
      errors: validatedFields.error.issues,
    };
  }

  // 4. Preparar datos para Supabase
  const dataToUpsert = validatedFields.data;
  const circuitId = dataToUpsert.id;

  // Si no hay logoUrl, quitarlo del objeto para no sobrescribir con undefined
  if (!dataToUpsert.logoUrl) {
    delete dataToUpsert.logoUrl;
  }

  // Eliminar ID del objeto si es para inserción
  if (!circuitId) {
    delete dataToUpsert.id;
  }

  // 5. Realizar operación en Supabase (INSERT o UPDATE)
  try {
    let supabaseError;
    let resultData: CircuitSchema | null = null;

    if (circuitId) {
      // UPDATE
      console.log("Actualizando circuito:", circuitId, dataToUpsert);
      const { data, error } = await supabase
        .from("Tour")
        .update(dataToUpsert)
        .eq("id", circuitId)
        .select()
        .single();
      supabaseError = error;
      resultData = data;
    } else {
      // INSERT
      console.log("Insertando circuito:", dataToUpsert);
      const { data, error } = await supabase
        .from("Tour")
        .insert(dataToUpsert)
        .select()
        .single();
      supabaseError = error;
      resultData = data;
    }

    // 6. Manejar errores de Supabase
    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      if (
        supabaseError.code === "23505" &&
        supabaseError.message.includes("Tour_slug_key") // Revisar el nombre de la constraint
      ) {
        return {
          status: "error",
          message: "Error: El slug ya existe. Por favor, elige otro.",
          errors: null,
        };
      }
      return {
        status: "error",
        message: `Error al guardar: ${supabaseError.message}`,
        errors: null,
      };
    }

    // 7. Revalidar caché y devolver éxito
    console.log("Circuito guardado:", resultData);
    revalidatePath("/dashboard/circuitos");
    const successMessage = circuitId
      ? "Circuito actualizado."
      : "Circuito creado.";
    return {
      status: "success",
      message: successMessage,
      data: resultData ?? undefined, // Devolver los datos guardados
    };
  } catch (e) {
    console.error("Unexpected Error:", e);
    return {
      status: "error",
      message: "Ocurrió un error inesperado.",
    };
  }
}

export async function deleteCircuitAction(
  id: number
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();

  console.log("Intentando eliminar circuito con id:", id);

  try {
    const { error } = await supabase.from("Tour").delete().eq("id", id);

    if (error) {
      console.error("Supabase error al eliminar:", error);
      return {
        success: false,
        message: error.message || "Error al eliminar el circuito.",
      };
    }

    console.log("Circuito eliminado con id:", id);
    revalidatePath("/dashboard/circuitos");
    return { success: true, message: "Circuito eliminado con éxito." };
  } catch (e) {
    console.error("Unexpected error al eliminar:", e);
    return { success: false, message: "Un error inesperado ocurrió." };
  }
}
