import { z } from "zod";

export const tournamentSchema = z.object({
  // Campo oculto para manejar la ID en actualizaciones
  id: z.coerce.number().optional(),

  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(3, { message: "El slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo letras minúsculas, números y guiones).",
    }), // Validar formato slug

  casinoId: z.coerce
    .number({
      required_error: "Debes seleccionar un casino.",
      invalid_type_error: "Debes seleccionar un casino.",
    })
    .int()
    .positive({ message: "Debes seleccionar un casino." }),

  // eventId es opcional, pero si se proporciona debe ser un número positivo
  eventId: z.coerce.number().int().positive().optional().nullable(), // Permite null o undefined

  date: z.coerce.date({
    required_error: "La fecha es requerida.",
    invalid_type_error: "Formato de fecha inválido.",
  }),

  time: z
    .string({ required_error: "La hora es requerida." })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Formato de hora inválido (HH:mm).",
    }),

  buyin: z
    .string({ required_error: "El buy-in es requerido." })
    .min(1, { message: "El buy-in es requerido." }), // Puede ser texto como "100+10"

  // Campos opcionales (string)
  fee: z.string().optional(),
  points: z.string().optional(),
  leveltime: z.string().optional(),
  punctuality: z.string().optional(),
  bounty: z.string().optional(),
  registerlevels: z.string().optional(),
  content: z.string().optional(),

  // Draft es opcional, por defecto false
  draft: z.boolean().optional().default(false),
});

export type TournamentSchema = z.infer<typeof tournamentSchema>;

// Esquema para el formulario de Casino
export const casinoSchema = z.object({
  // ID oculto para actualizaciones
  id: z.coerce.number().optional(),

  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(3, { message: "El slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo minúsculas, números y guiones).",
    }),

  logo: z
    .string({ required_error: "Se requiere la URL del logo." })
    .url({ message: "Debe ser una URL válida." }),

  // Validar color como código hexadecimal (#rrggbb o #rgb)
  color: z
    .string({ required_error: "El color es requerido." })
    .regex(/^#([0-9a-f]{3}){1,2}$/i, {
      message: "Formato de color inválido (ej. #FF0000 o #F00).",
    }),

  content: z
    .string({ required_error: "El contenido es requerido." })
    .min(1, { message: "El contenido no puede estar vacío." }), // O ajustar min según necesidad
});

export type CasinoSchema = z.infer<typeof casinoSchema>;

// Esquema para el formulario de Evento
export const eventSchema = z
  .object({
    id: z.coerce.number().optional(),

    name: z
      .string({ required_error: "El nombre es requerido." })
      .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),

    slug: z
      .string({ required_error: "El slug es requerido." })
      .min(3, { message: "El slug debe tener al menos 3 caracteres." })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug inválido (solo minúsculas, números y guiones).",
      }),

    casinoId: z.coerce
      .number({
        required_error: "Debes seleccionar un casino.",
        invalid_type_error: "Debes seleccionar un casino.",
      })
      .int()
      .positive({ message: "Debes seleccionar un casino." }),

    tourId: z.coerce
      .number({
        required_error: "Debes seleccionar un circuito.",
        invalid_type_error: "Debes seleccionar un circuito.",
      })
      .int()
      .positive({ message: "Debes seleccionar un circuito." }),

    from: z.coerce.date({
      required_error: "La fecha 'Desde' es requerida.",
      invalid_type_error: "Formato de fecha 'Desde' inválido.",
    }),

    to: z.coerce.date({
      required_error: "La fecha 'Hasta' es requerida.",
      invalid_type_error: "Formato de fecha 'Hasta' inválido.",
    }),

    draft: z.boolean().optional().default(false),
  })
  .refine((data) => data.to >= data.from, {
    message: "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.",
    path: ["to"], // Asociar error al campo 'to'
  });

export type EventSchema = z.infer<typeof eventSchema>;

// Esquema para el formulario de Circuito (Tour)
export const circuitSchema = z.object({
  // ID oculto para actualizaciones
  id: z.coerce.number().optional(),

  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(3, { message: "El slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo minúsculas, números y guiones).",
    }),

  // La URL del logo es opcional en el schema porque la subida
  // se maneja en cliente, pero el campo debe existir en el form.
  logoUrl: z.string().url({ message: "Debe ser una URL válida." }).optional(),
});

export type CircuitSchema = z.infer<typeof circuitSchema>;
