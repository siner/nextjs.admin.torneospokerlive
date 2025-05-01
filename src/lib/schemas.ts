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

// Esquema para el formulario de Categoría del Blog
export const blogCategorySchema = z.object({
  id: z.string().uuid().optional(), // ID es UUID en Supabase

  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(3, { message: "El slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo minúsculas, números y guiones).",
    }),
});

export type BlogCategorySchema = z.infer<typeof blogCategorySchema>;

// Esquema para el formulario de Tag del Blog
export const blogTagSchema = z.object({
  id: z.string().uuid().optional(), // ID es UUID en Supabase

  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }), // Tags pueden ser más cortos

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(2, { message: "El slug debe tener al menos 2 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo minúsculas, números y guiones).",
    }),
});

export type BlogTagSchema = z.infer<typeof blogTagSchema>;

// Esquema para el formulario de Post del Blog
export const blogPostSchema = z.object({
  id: z.string().uuid().optional(), // ID para actualizaciones

  title: z
    .string({ required_error: "El título es requerido." })
    .min(5, { message: "El título debe tener al menos 5 caracteres." }),

  slug: z
    .string({ required_error: "El slug es requerido." })
    .min(5, { message: "El slug debe tener al menos 5 caracteres." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug inválido (solo minúsculas, números y guiones).",
    }),

  // Contenido del editor (probablemente HTML)
  content: z
    .string({ required_error: "El contenido es requerido." })
    .min(10, { message: "El contenido debe tener al menos 10 caracteres." }),

  // ID de la categoría (opcional)
  category_id: z
    .string()
    .uuid({ message: "ID de categoría inválido." })
    .optional()
    .nullable(),

  // Array de IDs de tags seleccionados
  tags: z
    .array(z.string().uuid({ message: "ID de tag inválido." }))
    .optional()
    .default([]), // Por defecto, array vacío si no se seleccionan tags

  // URL de la imagen destacada (opcional)
  featured_image_url: z
    .string()
    .url({ message: "URL de imagen inválida." })
    .optional()
    .nullable(),

  // Estado del post (draft por defecto en DB, pero validamos aquí)
  status: z.enum(["draft", "published"], {
    required_error: "El estado es requerido.",
    invalid_type_error: "Estado inválido (debe ser 'draft' o 'published').",
  }),

  // Fecha de publicación (opcional, podría establecerse al publicar)
  published_at: z.coerce // Usar coerce para convertir string ISO a Date
    .date({ invalid_type_error: "Formato de fecha inválido." })
    .optional()
    .nullable(),

  // author_id no se incluye aquí, se añadirá en la server action
});

export type BlogPostSchema = z.infer<typeof blogPostSchema>;
