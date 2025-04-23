# Flujo de Usuarios y Estructura del Proyecto

## Recorrido del Usuario (User Journey)

- (Describe los pasos típicos que un usuario sigue al interactuar con la aplicación)

## Flujo de Datos

- (Diagrama o describe cómo fluyen los datos a través del sistema)

## Estructura de Archivos del Proyecto (`src/`)

El proyecto sigue una estructura estándar para aplicaciones Next.js con App Router.

- **`src/app/`**: Contiene todas las rutas y páginas de la aplicación.
  - `layout.tsx`: Layout raíz principal.
  - `page.tsx`: Página de inicio (probablemente redirige o muestra login).
  - `globals.css`: Estilos globales.
  - `form-login.tsx`: Componente específico para el formulario de login (usado en `/` o `/login`).
  - `dashboard/`: Contiene las rutas protegidas del panel de administración.
    - `layout.tsx`: Layout específico para el dashboard (incluye navegación lateral/header).
    - `page.tsx`: Página principal del dashboard.
    - `casinos/`, `circuitos/`, `eventos/`, `torneos/`: Carpetas para cada CRUD, siguiendo la convención de rutas de App Router (`page.tsx` para listado, `edit/page.tsx` para crear, `edit/[id]/page.tsx` para editar, etc.). Cada una contiene sus propios componentes `columns.tsx` y `data-table.tsx`.
    - `usuarios/`: (Contenido no explorado, presumiblemente CRUD de usuarios).
  - `auth/`: Contiene rutas específicas para el flujo de autenticación.
    - `callback/route.ts`: Maneja el callback de Supabase Auth.
    - `signout/route.ts`: (Presumiblemente) Maneja el cierre de sesión.
- **`src/components/`**: Almacena componentes React reutilizables.
  - `ui/`: Componentes base de `shadcn/ui` (Button, Input, Card, Select, Calendar, etc.).
  - `datatables/`: Componentes específicos para las tablas interactivas (`DataTablePagination`, `DataTableColumnHeader`).
  - `layout/`: Componentes estructurales como `Header`.
- **`src/lib/`**: Contiene lógica auxiliar y configuración.
  - `api.ts`: Funciones para interactuar con la API de Supabase desde el servidor (`getAll...`, `get...ById`).
  - `utils.ts`: Funciones de utilidad general (formato de clases `cn`, formato de fechas, cálculo de paginación, cálculo de contraste de color).
  - `supabase/`: Configuración para crear los clientes de Supabase (`client.ts`, `server.ts`, `middleware.ts`).

**Archivos de Configuración (Raíz)**:

- `middleware.ts`: Middleware de Next.js para proteger rutas usando Supabase Auth.
- `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`: Archivos estándar de configuración de Next.js, TypeScript, Tailwind y shadcn/ui.
- `sentry.*.config.ts`: Archivos de configuración para la integración con Sentry (monitorización de errores).
