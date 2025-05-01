# Gestión de Tareas del Proyecto

## Pendiente (To Do)

### Feature: Listados Mejorados

- [x] Definir filtros específicos necesarios para cada listado (Torneos, Eventos, Casinos).
  - Torneos: Nombre, Casino, Evento, Rango de Fechas.
  - Eventos: Nombre, Casino, Circuito, Rango de Fechas.
  - Casinos: OK (Nombre es suficiente).
- [x] Implementar filtro por Rango de Fechas en listado de Torneos.
- [x] Implementar filtro por Casino en listado de Eventos.
- [x] Implementar filtro por Circuito en listado de Eventos.
- [x] Implementar filtro por Rango de Fechas en listado de Eventos.

### Feature: Mejora de Formularios (Usabilidad y Server Actions)

- [x] Definir mejoras específicas de validación, usabilidad y consistencia en formularios (analizando FormTorneo).
- [x] Refactorizar FormCasino a Server Actions.
- [x] Refactorizar FormEvento a Server Actions.
- [x] Refactorizar FormCircuito a Server Actions.
- [ ] Implementar mejoras de validación, usabilidad y consistencia definidas (en todos los forms).

### Feature: Mejora Flujo Gestión Torneos

- [ ] Definir simplificación deseada para clonación de torneos (discutir al iniciar tarea).
- [ ] Implementar clonación simplificada de torneos.
- [ ] Diseñar UI/UX para creación masiva de torneos desde Eventos.
- [ ] Implementar UI para creación masiva de torneos.
- [ ] Implementar Server Action para creación masiva de torneos.
- [ ] Integrar creación masiva en flujo de Eventos.

### Feature: Gestión de Blog (Admin)

- [x] Diseñar schema de base de datos para Posts, Categorías, Tags y Comentarios en Supabase.
- [x] Crear migraciones de Supabase para las nuevas tablas del blog.
- [x] Generar tipos de TypeScript a partir del nuevo schema.
- [x] Definir y aplicar políticas RLS y permisos GRANT para todas las tablas del blog (permitir CRUD a usuarios autenticados/admin).
- [x] CRUD Categorías:
  - [x] Definir schema Zod para Categorías.
  - [x] Crear Server Actions para CRUD de Categorías.
  - [x] Crear DataTable para listar Categorías.
  - [x] Crear Formulario para crear/editar Categorías.
  - [x] Integrar listado y formulario en `/dashboard/blog/categorias`.
- [x] CRUD Tags:
  - [x] Definir schema Zod para Tags.
  - [x] Crear Server Actions para CRUD de Tags.
  - [x] Crear DataTable para listar Tags.
  - [x] Crear Formulario para crear/editar Tags.
  - [x] Integrar listado y formulario en `/dashboard/blog/tags`.
- [x] CRUD Posts:
  - [x] Definir schema Zod para Posts (incluir relaciones con Categoría y Tags, estado, etc.).
  - [x] Crear Server Actions para CRUD de Posts.
  - [x] Crear DataTable para listar Posts (mostrar título, categoría, estado, fecha).
  - [x] Añadir columna con número de comentarios a DataTable de Posts.
  - [x] Crear Formulario para crear/editar Posts (TipTap, selector categoría, multi-select tags, Cloudflare image upload, status).
  - [x] Integrar listado y formulario en `/dashboard/blog/posts`.
  - [x] Verificar que `upsertBlogPostAction` maneja correctamente `category_id = ""` (guardando `null`).
- [x] Añadir DatePicker para `published_at` en formulario de Post.
- [x] Añadir creación rápida de categorías desde formulario de Post (modal).
- [x] Añadir creación rápida de tags desde formulario de Post (modal). -> Reemplazado por Dropdown con búsqueda ✅
- [x] Gestión Comentarios (inicial):
  - [x] Crear Server Action `deleteBlogCommentAction`.
  - [x] Crear DataTable para listar Comentarios (con acción eliminar).
  - [x] Integrar DataTable en página de edición del Post.

### Otros

- [ ] (Opcional) Añadir tarea para implementar testing.
- [ ] (Pendiente) Investigar/Solucionar obtención de autor en listado de comentarios.

## En Progreso (In Progress)

- [ ] Aumentar/configurar el número de elementos por página por defecto en las tablas.
- [ ] Implementar filtro por Rango de fechas en listado de Torneos
- [ ] Implementar filtros en listado de Eventos (pendiente definir filtros)
- [ ] Implementar búsqueda por nombre en listado de Circuitos (si aplica)
- [ ] Implementar búsqueda por nombre en listado de Casinos (si aplica)

## Completado (Done)

- [x] Crear estructura inicial de documentación en `project-docs`.
- [x] Aumentar el número de elementos por página por defecto a 50 en todas las tablas.
- [x] Documentar el flujo y los componentes del CRUD de Torneos.
- [x] Documentar el formulario y lógica de Creación de Torneos (`/dashboard/torneos/edit` via `form-torneo.tsx`).
- [x] Documentar la página contenedora de Edición (`/dashboard/torneos/edit/[id]/page.tsx`).
- [x] Documentar el formulario y lógica de Clonación de Torneos (`/dashboard/torneos/clone/[id]` via `form-clone-torneo.tsx`).
- [x] Investigar las funciones `getAll...()` y `getTournamentById()` en `@/lib/api`.
- [x] Documentar el flujo y los componentes del CRUD de Casinos.
- [x] Documentar el formulario y lógica de Creación de Casinos (`/dashboard/casinos/edit` via `form-casino.tsx`).
- [x] Documentar el formulario y lógica de Edición de Casinos (`/dashboard/casinos/edit/[id]` via `form-casino.tsx`).
- [x] Investigar la función `getCasinoById()` en `@/lib/api`.
- [x] Documentar el flujo y los componentes del CRUD de Eventos.
- [x] Documentar el formulario y lógica de Creación de Eventos (`/dashboard/eventos/edit` via `form-evento.tsx`).
- [x] Documentar el formulario y lógica de Edición de Eventos (`/dashboard/eventos/edit/[id]` via `form-evento.tsx`).
- [x] Investigar la función `getEventById()` en `@/lib/api`.
- [x] Corregir typo 'dradft' a 'draft' en `src/app/dashboard/eventos/columns.tsx`.
- [x] Documentar el flujo y los componentes del CRUD de Circuitos.
- [x] Documentar el formulario y lógica de Creación de Circuitos (`/dashboard/circuitos/edit` via `form-circuito.tsx`).
- [x] Documentar el formulario y lógica de Edición de Circuitos (`/dashboard/circuitos/edit/[id]` via `form-circuito.tsx`).
- [x] Investigar la función `getTourById()` en `@/lib/api`.
- [x] Corregir uso de campo 'color' inexistente en `src/app/dashboard/circuitos/columns.tsx` y `src/app/dashboard/circuitos/edit/[id]/page.tsx`.
- [x] Corregir enlace 'Back' en `src/app/dashboard/circuitos/edit/page.tsx` y `src/app/dashboard/circuitos/edit/[id]/page.tsx`.
- [x] Revisar y documentar la configuración de autenticación con Supabase Auth.
- [x] Documentar la estructura general del proyecto (App Router, componentes principales, utils, etc.) en `user-structure.md`.
- [x] Definir y documentar los Métodos de Desarrollo en `tech-specs.md`.
- [x] Definir y documentar los Estándares de Codificación en `tech-specs.md`.
- [x] Implementar filtro por Casino en listado de Torneos.
- [x] Implementar filtro por Evento en listado de Torneos.
- [x] Implementar filtro por Rango de Fechas en listado de Torneos.
- [x] Implementar filtro por Evento en listado de Torneos.
- [x] Implementar filtro por Rango de Fechas en listado de Torneos.
- [x] Implementar filtro por Casino en listado de Eventos.
- [x] Implementar filtro por Circuito en listado de Eventos.
- [x] Implementar filtro por Rango de Fechas en listado de Eventos.
- [x] Refactorizar FormTorneo a Server Actions (incluye schema Zod, action, uso de hooks useFormState/useFormStatus).
- [x] Implementar eliminación de Torneos desde el listado (Server Action, diálogo confirmación, RLS).
- [x] Implementar mejoras de usabilidad en FormTorneo (cierre calendario, slug auto).
- [x] Refactorizar FormCloneTorneo a Server Actions y aplicar mejoras usabilidad.
- [x] Refactorizar FormCasino a Server Actions (schema, action, hooks), manteniendo subida de logo en cliente.
- [x] Refactorizar FormEvento a Server Actions (schema, action, hooks).
- [x] Implementar eliminación de Eventos desde el listado (Server Action, diálogo confirmación con chequeo de torneos asociados).
- [x] Refactorizar FormCircuito a Server Actions (schema, action, hooks, subida logo cliente).
- [x] Implementar eliminación de Circuitos desde el listado (Server Action, diálogo confirmación modificado).

### Relevant Files

- `src/lib/schemas.ts` - Definidos schemas Zod (`tournamentSchema`, `casinoSchema`, `eventSchema`, `circuitSchema`, `blogCategorySchema`, `blogTagSchema`).
- `src/lib/actions/tournaments.ts` - Definidas Server Actions `upsertTournamentAction` y `deleteTournamentAction`.
- `src/lib/actions/casinos.ts` - Definida Server Action `upsertCasinoAction`.
- `src/lib/actions/events.ts` - Definidas Server Actions `upsertEventAction` y `deleteEventAction`.
- `src/lib/actions/circuits.ts` - Definidas Server Actions `upsertCircuitAction` y `deleteCircuitAction`.
- `src/lib/actions/blogCategories.ts` - Definidas Server Actions `upsertBlogCategoryAction` y `deleteBlogCategoryAction`.
- `src/lib/actions/blogTags.ts` - Definidas Server Actions `upsertBlogTagAction` y `deleteBlogTagAction`.
- `src/app/dashboard/torneos/edit/form-torneo.tsx` - Refactorizado para usar Server Action, Zod, `useFormState`, `useFormStatus`.
- `src/app/dashboard/torneos/clone/form-clone-torneo.tsx` - Refactorizado para usar Server Action y mejoras de usabilidad.
- `src/app/dashboard/casinos/edit/form-casino.tsx` - Refactorizado para usar Server Action (manteniendo subida logo en cliente).
- `src/app/dashboard/eventos/edit/form-evento.tsx` - Refactorizado para usar Server Action, Zod, `useFormState`, `useFormStatus`.
- `src/app/dashboard/circuitos/edit/form-circuito.tsx` - Refactorizado para usar Server Action, Zod, `useFormState`, `useFormStatus`.
- `src/components/dialogs/delete-confirmation-dialog.tsx` - Modificado para aceptar `itemId` como `string | number`.
- `src/app/dashboard/torneos/page.tsx` - Modificado para pasar lista de casinos y eventos a DataTable.
- `src/app/dashboard/torneos/columns.tsx` - Añadido botón de eliminar con diálogo de confirmación en columna de acciones (con wrapper para ID number).
- `src/app/dashboard/torneos/data-table.tsx` - Modificado para añadir filtros (Selects, DateRangePicker) y aceptar props.
- `src/components/ui/date-range-picker.tsx` - Creado componente para seleccionar rango de fechas.
- `src/app/dashboard/eventos/page.tsx` - Modificado para pasar lista de casinos y tours a DataTable.
- `src/app/dashboard/eventos/columns.tsx` - Modificado para añadir columnas ocultas (`casinoId`, `tourId`), `filterFn` para `from`, y botón de eliminar con diálogo de confirmación.
- `src/app/dashboard/eventos/data-table.tsx` - Modificado para añadir filtros (Selects, DateRangePicker) y aceptar props.
- `src/app/dashboard/casinos/data-table.tsx` - Modificado para poner 50 items por página por defecto.
- `src/app/dashboard/circuitos/columns.tsx` - Añadido DropdownMenu y opción Eliminar usando diálogo modificado.
- `src/app/dashboard/blog/categorias/columns.tsx` - Creado para listar categorías (con wrapper para ID string).
- `src/app/dashboard/blog/categorias/data-table.tsx` - Creado para mostrar tabla de categorías.
- `src/app/dashboard/blog/categorias/edit/form-blog-category.tsx` - Creado formulario de categorías.
- `src/app/dashboard/blog/categorias/page.tsx` - Creada página de listado de categorías.
- `src/app/dashboard/blog/categorias/edit/page.tsx` - Creada página de creación de categorías.
- `src/app/dashboard/blog/categorias/edit/[id]/page.tsx` - Creada página de edición de categorías.
- `src/app/dashboard/blog/tags/columns.tsx` - Creado para listar tags.
- `src/app/dashboard/blog/tags/data-table.tsx` - Creado para mostrar tabla de tags.
- `src/app/dashboard/blog/tags/edit/form-blog-tag.tsx` - Creado formulario de tags.
- `src/app/dashboard/blog/tags/page.tsx` - Creada página de listado de tags.
- `src/app/dashboard/blog/tags/edit/page.tsx` - Creada página de creación de tags.
- `src/app/dashboard/blog/tags/edit/[id]/page.tsx` - Creada página de edición de tags.
- `src/app/dashboard/blog/posts/edit/form-blog-post.tsx` - Creado formulario de posts (con corrección error SelectItem "").
