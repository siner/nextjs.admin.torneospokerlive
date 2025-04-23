# Especificaciones Técnicas

## Pila Tecnológica

- **Framework:** Next.js (con App Router)
- **Lenguaje:** TypeScript
- **UI:** React, Tailwind CSS, shadcn/ui
- **Backend & Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Estilo de Código:** (Probablemente ESLint/Prettier - por confirmar/configurar)
- **Otros:** (Posiblemente Sentry para errores, según archivos raíz)

## Métodos de Desarrollo

- **Control de Versiones:** Se utilizará el flujo **Gitflow**.
  - `main`: Rama principal para producción. Solo se mergea desde `release`.
  - `develop`: Rama de integración principal para desarrollo. Las nuevas características parten de aquí.
  - `feature/nombre-feature`: Ramas para desarrollar nuevas funcionalidades. Parten de `develop` y se mergean de vuelta a `develop`.
  - `release/vX.Y.Z`: Ramas para preparar un lanzamiento. Parten de `develop`, se hacen ajustes finales y se mergean a `main` y `develop`.
  - `hotfix/nombre-hotfix`: Ramas para correcciones urgentes en producción. Parten de `main` y se mergean a `main` y `develop`.
- **Despliegue:** Se despliega en **Cloudflare Pages** utilizando `@cloudflare/next-on-pages`.
- **Testing:** Actualmente no implementado. (Añadir como tarea futura si se considera necesario).

## Estándares de Codificación

- **Linting y Formato:** Se utiliza **ESLint** y **Prettier** con las configuraciones definidas en el proyecto (`.eslintrc.json`, `prettier` config en `package.json` o archivo dedicado si existe). Asegurar la ejecución antes de hacer commit.
- **Nomenclatura:**
  - Nombres de archivo de Componentes React: `kebab-case` (e.g., `mi-componente.tsx`, `events-columns.tsx`).
  - Nombre del Componente React (dentro del archivo): `PascalCase` (e.g., `function MiComponente()`, `const EventsColumns = ...`).
  - Variables y Funciones (no componentes): `camelCase` (e.g., `myVariable`, `getData()`).
  - Tipos e Interfaces: `PascalCase` (e.g., `type UserProfile`, `interface ButtonProps`).
  - Constantes: `UPPER_SNAKE_CASE` (e.g., `const MAX_ITEMS = 10;`).
- **Comentarios:** Añadir comentarios JSDoc a funciones y componentes complejos para explicar su propósito, parámetros y retorno. Evitar comentarios obvios.
- **Importaciones:** Organizar importaciones (React, librerías externas, componentes internos, estilos).

## Diseño de Base de Datos

- Gestionado a través de Supabase.
- (Se pueden añadir detalles del esquema o diagramas aquí si es necesario)

## API y Obtención de Datos (`src/lib/api.ts`)

Se utiliza un archivo centralizado para interactuar con Supabase desde el servidor (usando `@/lib/supabase/server`). Las funciones principales incluyen:

- **`getAllTournaments()`:** Obtiene todos los torneos, incluyendo datos anidados de Casino y Evento (con su Tour). Ordenados por fecha (desc) y hora (asc).
- **`getTournamentById(id)`:** Obtiene un torneo específico por ID, incluyendo datos anidados de Casino y Evento (con su Casino y Tour).
- **`getAllCasinos()`:** Obtiene todos los casinos, incluyendo datos de `casino_stars`. Ordenados por nombre.
- **`getCasinoById(id)`:** Obtiene un casino específico por ID, seleccionando todos sus campos directos (`*`).
- **`getAllEvents()`:** Obtiene todos los eventos, incluyendo datos anidados de Tour y Casino. Ordenados por fecha `from` (desc).
- **`getEventById(id)`:** Obtiene un evento específico por ID, incluyendo datos anidados de Tour y Casino.
- **`getAllTours()`:** Obtiene todos los tours (circuitos). Ordenados por nombre.
- **`getTourById(id)`:** Obtiene un tour (circuito) específico por ID, seleccionando todos sus campos directos (`*`).
- Otras funciones: Existen funciones similares para obtener datos de Usuarios, y versiones "draft" de Torneos y Eventos.

_Nota: Las operaciones de escritura (insert/update) para torneos se manejan directamente en los componentes del formulario (`FormTorneo`, `FormCloneTorneo`) usando el cliente Supabase del lado del cliente (`@/lib/supabase/client`)._

## Autenticación (Supabase Auth)

Se utiliza Supabase Auth para gestionar la autenticación de usuarios en el panel de administración.

**Configuración Clientes Supabase (`src/lib/supabase/`)**:

- **`client.ts`**: Crea un cliente para el navegador (`createBrowserClient`) usando variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Se usa para acciones de auth en el cliente (login, logout).
- **`server.ts`**: Crea un cliente para el servidor (`createServerClient`) usando las mismas variables públicas y gestionando cookies (`next/headers`) para sincronizar sesión. Se usa en Server Components/Actions/Route Handlers.
- **`middleware.ts`**: Define `updateSession` que crea un cliente específico para middleware, refrescando la sesión en cada request mediante cookies.

**Middleware de Protección de Rutas (`middleware.ts` en raíz)**:

- Utiliza `@supabase/auth-helpers-nextjs` para obtener la sesión actual.
- Define rutas públicas (`/login`, `/registro`, `/forgot-password`).
- **Lógica**:
  - Si usuario autenticado está en ruta pública -> Redirige a la raíz.
  - Si usuario no autenticado no está en ruta pública -> Redirige a `/login`.
- **Matcher**: Protege todas las rutas por defecto, excepto assets y API.

**Flujo de Autenticación**:

- **Login**: El componente `src/app/form-login.tsx` (usado probablemente en `/login` o `/`) maneja el formulario de email/contraseña. Llama a `signInWithPassword` usando el cliente de navegador. En caso de éxito, redirige a `/dashboard`. Muestra errores basados en credenciales o parámetro `allowed=false`.
- **Callback (`/auth/callback/route.ts`)**: Route Handler (GET) que maneja el código de autorización devuelto por Supabase (ej. tras OAuth o magic link). Usa `exchangeCodeForSession` y redirige al usuario a la página original (`next` param) o a la raíz.
- **Signout (`/auth/signout/route.ts`)**: (Archivo no leído, pero se infiere) Probablemente un Route Handler que llama a `supabase.auth.signOut()` y redirige a `/login`. El componente `form-login.tsx` también tiene una función `logout` que hace esto.

**Gestión de Sesión**:

- Se basa en cookies gestionadas por Supabase SSR/Auth Helpers.
- El middleware (`updateSession` y el root `middleware.ts`) se encarga de mantener la sesión actualizada y proteger las rutas.
- No parece haber un Context Provider explícito en `RootLayout`.

**Variables de Entorno Requeridas**:

- `NEXT_PUBLIC_SUPABASE_URL`: URL pública del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima pública del proyecto Supabase.
