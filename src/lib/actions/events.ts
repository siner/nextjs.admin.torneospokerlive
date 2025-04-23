"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { eventSchema } from "@/lib/schemas"; // Importar schema de evento
import { revalidatePath } from "next/cache";
import { format } from "date-fns"; // Para formatear fechas para Supabase

export type EventActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[] | null;
  requiresConfirmation?: false;
};

export type EventDeleteWarningState = {
  success: false;
  message: string;
  errors?: null;
  requiresConfirmation: true;
  tournamentCount: number;
};

export type DeleteEventActionResult =
  | EventActionState
  | EventDeleteWarningState;

export async function upsertEventAction(
  prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const supabase = createClient();

  // 1. Convertir FormData a objeto
  const formValues = Object.fromEntries(formData.entries());

  // Manejar checkbox 'draft'
  const draftValue = formData.get("draft") === "on";

  // Preparar objeto para Zod
  const objectToValidate = {
    ...formValues,
    id: formValues.id ? Number(formValues.id) : undefined,
    casinoId: formValues.casinoId,
    tourId: formValues.tourId,
    // Fechas serán coaccionadas por Zod
    from: formValues.from,
    to: formValues.to,
    draft: draftValue,
  };

  // 2. Validar con Zod
  const validatedFields = eventSchema.safeParse(objectToValidate);

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
      requiresConfirmation: false,
    };
  }

  // 4. Preparar datos para Supabase (formatear fechas)
  const dataToUpsert = {
    ...validatedFields.data,
    from: format(validatedFields.data.from, "yyyy-MM-dd"),
    to: format(validatedFields.data.to, "yyyy-MM-dd"),
  };

  const eventId = dataToUpsert.id;
  if (!eventId) {
    delete dataToUpsert.id;
  }

  // 5. Operación Supabase
  try {
    let supabaseError;
    if (eventId) {
      // UPDATE
      console.log("Attempting to update event:", eventId, dataToUpsert);
      const { error } = await supabase
        .from("Event")
        .update(dataToUpsert)
        .eq("id", eventId);
      supabaseError = error;
    } else {
      // INSERT
      console.log("Attempting to insert event:", dataToUpsert);
      const { error } = await supabase.from("Event").insert(dataToUpsert);
      supabaseError = error;
    }

    // 6. Manejar errores Supabase
    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      // Comprobar error específico de slug duplicado (ajustar nombre constraint si es necesario)
      if (
        supabaseError.code === "23505" &&
        supabaseError.message.includes("Event_slug_key")
      ) {
        return {
          success: false,
          message: "Error: El slug ya existe.",
          errors: null,
          requiresConfirmation: false,
        };
      }
      return {
        success: false,
        message: `Error al guardar en la base de datos: ${supabaseError.message}`,
        errors: null,
        requiresConfirmation: false,
      };
    }

    // 7. Revalidar y devolver éxito
    revalidatePath("/dashboard/eventos");
    const successMessage = eventId ? "Evento actualizado." : "Evento creado.";

    // Sin redirección desde aquí
    return {
      success: true,
      message: successMessage,
      errors: null,
      requiresConfirmation: false,
    };
  } catch (error) {
    console.error("Unexpected Error:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado.",
      errors: null,
      requiresConfirmation: false,
    };
  }
}

export async function deleteEventAction(
  id: number,
  forceDelete: boolean = false
): Promise<DeleteEventActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Se requiere ID del evento.",
      requiresConfirmation: false,
    };
  }

  const supabase = createClient();

  try {
    if (!forceDelete) {
      const { count, error: countError } = await supabase
        .from("Tournament")
        .select("*", { count: "exact", head: true })
        .eq("eventId", id);

      if (countError) {
        console.error("Supabase Count Error:", countError);
        return {
          success: false,
          message: "Error al verificar torneos asociados.",
          requiresConfirmation: false,
        };
      }

      if (count && count > 0) {
        return {
          success: false,
          requiresConfirmation: true,
          tournamentCount: count,
          message: `Este evento tiene ${count} torneo(s) asociado(s). Si continúas, también se eliminarán.`,
        };
      }
    }

    if (forceDelete) {
      console.log(`Forced delete: Deleting tournaments for eventId: ${id}`);
      const { error: deleteTournamentsError } = await supabase
        .from("Tournament")
        .delete()
        .eq("eventId", id);

      if (deleteTournamentsError) {
        console.error(
          "Supabase Delete Tournaments Error:",
          deleteTournamentsError
        );
        return {
          success: false,
          message: `Error al eliminar torneos asociados: ${deleteTournamentsError.message}`,
          requiresConfirmation: false,
        };
      }
    }

    console.log(`Attempting to delete event with id: ${id}`);
    const { error: deleteEventError } = await supabase
      .from("Event")
      .delete()
      .eq("id", id);

    if (deleteEventError) {
      console.error("Supabase Delete Event Error:", deleteEventError);
      return {
        success: false,
        message: `Error al eliminar el evento: ${deleteEventError.message}`,
        requiresConfirmation: false,
      };
    }

    revalidatePath("/dashboard/eventos");
    revalidatePath("/dashboard/torneos");
    console.log(
      `Successfully deleted event and associated tournaments (if any) for id: ${id}`
    );
    return {
      success: true,
      message: "Evento y torneos asociados eliminados con éxito.",
      requiresConfirmation: false,
    };
  } catch (error) {
    console.error("Unexpected Error during event deletion:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado.",
      requiresConfirmation: false,
    };
  }
}
