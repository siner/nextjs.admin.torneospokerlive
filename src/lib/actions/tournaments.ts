"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { tournamentSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Definir el tipo para el estado que devolverá la acción
export type TournamentActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[] | null; // Usaremos ZodIssue para errores detallados
};

export async function upsertTournamentAction(
  prevState: TournamentActionState,
  formData: FormData
): Promise<TournamentActionState> {
  const supabase = createClient();

  // 1. Convertir FormData a un objeto plano
  // Nota: FormData siempre envía valores como string o File.
  // Zod `coerce` ayuda con la conversión, pero hay que manejar casos especiales.
  const formValues = Object.fromEntries(formData.entries());

  // Manejar checkbox 'draft': FormData no envía nada si está desmarcado.
  const draftValue = formData.get("draft") === "on";

  // Asegurar que trabajamos con string y definir tipo explícito que permite null
  let eventIdForValidation: string | null = String(formValues.eventId ?? "");
  if (eventIdForValidation === "-" || eventIdForValidation === "") {
    eventIdForValidation = null;
  }

  // Preparar objeto para Zod
  const objectToValidate = {
    ...formValues,
    // Convertir ID explícitamente si existe (viene de un input hidden)
    id: formValues.id ? Number(formValues.id) : undefined,
    // Asegurar que casinoId se intente convertir a número
    casinoId: formValues.casinoId,
    // Usar el valor procesado de eventId
    eventId: eventIdForValidation,
    // Usar el valor procesado de draft
    draft: draftValue,
    // Otros campos que requieran manejo especial podrían ir aquí
    // date y time serán coaccionados por Zod
  };

  // 2. Validar con Zod
  const validatedFields = tournamentSchema.safeParse(objectToValidate);

  // 3. Manejar errores de validación
  if (!validatedFields.success) {
    console.error(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Error de validación. Revisa los campos marcados.",
      errors: validatedFields.error.issues, // Devolver issues para mapeo más fácil en cliente
    };
  }

  // 4. Preparar datos para Supabase (con fecha formateada)
  const dataToUpsert = {
    ...validatedFields.data,
    // Formatear fecha para Supabase (YYYY-MM-DD)
    date: format(validatedFields.data.date, "yyyy-MM-dd"),
    // Asegurar que eventId sea null si es opcional y no se proporcionó válidamente
    eventId: validatedFields.data.eventId ?? null,
  };

  // Convertir strings vacíos de campos numéricos opcionales a null antes de enviar a DB
  const numericOptionalFields: (keyof typeof dataToUpsert)[] = [
    "fee",
    "points",
    "registerlevels",
    "punctuality",
    "bounty",
  ];

  numericOptionalFields.forEach((field) => {
    // Verificar que el campo exista y sea un string vacío
    if (field in dataToUpsert && dataToUpsert[field] === "") {
      // Asegurarse de que TypeScript permita asignar null
      (dataToUpsert as any)[field] = null;
    }
  });

  // Remover ID del objeto si es para inserción
  const tournamentId = dataToUpsert.id;
  if (!tournamentId) {
    delete dataToUpsert.id; // No pasar ID en la inserción
  }

  // 5. Realizar operación en Supabase
  try {
    let supabaseError;
    if (tournamentId) {
      // UPDATE
      console.log(
        "Attempting to update tournament:",
        tournamentId,
        dataToUpsert
      );
      const { error } = await supabase
        .from("Tournament")
        .update(dataToUpsert)
        .eq("id", tournamentId);
      supabaseError = error;
    } else {
      // INSERT
      console.log("Attempting to insert tournament:", dataToUpsert);
      const { error } = await supabase.from("Tournament").insert(dataToUpsert);
      supabaseError = error;
    }

    // 6. Manejar errores de Supabase
    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      return {
        success: false,
        message: `Error al guardar en la base de datos: ${supabaseError.message}`,
        errors: null,
      };
    }

    // 7. Revalidar caché y devolver éxito
    revalidatePath("/dashboard/torneos");

    const successMessage = tournamentId
      ? "Torneo actualizado con éxito."
      : "Torneo creado con éxito.";

    // Opcional: Redirección en caso de creación exitosa
    // if (!tournamentId) {
    //   redirect('/dashboard/torneos');
    // }

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

// Acción para eliminar un torneo
export async function deleteTournamentAction(id: number): Promise<{
  success: boolean;
  message: string;
}> {
  if (!id) {
    return { success: false, message: "Se requiere ID del torneo." };
  }

  const supabase = createClient();

  try {
    console.log(`Attempting to delete tournament with id: ${id}`);
    const { error } = await supabase.from("Tournament").delete().eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      return {
        success: false,
        message: `Error al eliminar el torneo: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/torneos");
    console.log(`Successfully deleted tournament with id: ${id}`);
    return { success: true, message: "Torneo eliminado con éxito." };
  } catch (error) {
    console.error("Unexpected Error during deletion:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al intentar eliminar el torneo.",
    };
  }
}
