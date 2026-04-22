# VolunteerFlow Project Context (LLM Reference)

This file is a high-context technical guide for AI assistants and engineers working in this repository.

## 1) Project at a glance

VolunteerFlow is a full-stack nonprofit volunteer-management application with:

- A Laravel 11 backend API (`/api/*`) using session-based auth via Sanctum.
- A React + TypeScript frontend in `client/`, built with Vite and styled with Tailwind.
- Role-based user experiences for `admin`, `organizer`, and `volunteer`.
- Core domain areas: events, applications, documents, volunteer hours, notifications.

The frontend and backend are separate processes in local development.

## 2) High-level architecture

- Backend: monolithic Laravel API app in the repo root.
- Frontend: SPA in `client/` that talks to backend through Vite proxy.
- Auth model: cookie/session auth (not bearer token flow in current UI).
- Data store: Laravel relational DB (MySQL defaults in `.env.example`; SQLite file exists locally at `database/database.sqlite`).

Request path in local dev:

1. Browser calls frontend on Vite (default `http://localhost:5173`).
2. Frontend API client sends `/api/*` and `/sanctum/*`.
3. Vite proxies those calls to Laravel (`http://127.0.0.1:18080` as configured in `client/vite.config.ts`).
4. Laravel handles auth/session + business logic + database persistence.

## 3) Repository layout

Top-level folders:

- `app/`: backend source (controllers, models, middleware, providers).
- `bootstrap/`: Laravel app bootstrap and middleware alias setup.
- `client/`: React frontend app.
- `config/`: Laravel configuration files.
- `database/`: migrations, seeders, and local sqlite db file.
- `public/`: Laravel web root/static entrypoint.
- `resources/`: Laravel resources/views (not central to current API-first design).
- `routes/`: route definitions (`api.php`, `web.php`, `console.php`).
- `storage/`: Laravel runtime storage (logs, app files).
- `tests/`: PHPUnit feature tests.
- `vendor/`: Composer dependencies.

Top-level files:

- `composer.json`: backend dependencies and scripts.
- `phpunit.xml`: test suite config.
- `.env` / `.env.example`: environment configuration.
- `artisan`: Laravel CLI entrypoint.

## 4) Backend details (Laravel)

### 4.1 Core dependencies

From `composer.json`:

- `laravel/framework` `^11.0`
- `laravel/sanctum` `^4.0`
- `php` `^8.2`
- Dev: PHPUnit 11, Pint, Sail, Faker, Collision, Mockery

### 4.2 Middleware and auth wiring

`bootstrap/app.php` configures:

- Route files for web/api/console.
- Middleware alias: `role` -> `App\Http\Middleware\RoleMiddleware`.
- `EnsureFrontendRequestsAreStateful` prepended to `api` middleware group (important for Sanctum cookie auth from SPA).

`RoleMiddleware` checks:

- User is authenticated.
- User role is in route-allowed roles.
- Returns `403 Forbidden` JSON on failure.

### 4.3 Models and domain

Primary Eloquent models:

- `User`: includes role helpers `isAdmin()`, `isVolunteer()`, `isOrganizer()`.
- `Volunteer`: volunteer profile metadata linked to `user_id`.
- `Event`: created by user (`created_by`), has applications/hours.
- `Application`: volunteer applies to event; lifecycle status.
- `Document`: volunteer-submitted docs with review status.
- `Hour`: logged volunteer hours against events.
- `Notification`: user-targeted system notifications.

### 4.4 Controllers and behavior

- `AuthController`
  - `register`: volunteer/organizer self-registration (admin is seeded).
  - `login`: session login via `Auth::attempt`.
  - `logout`: invalidates session and regenerates token.
  - `me`: returns authenticated user or `401`.
- `EventController`
  - CRUD-ish endpoints; `destroy` guarded by admin route middleware.
  - Update is allowed for admins or event owner organizer.
- `ApplicationController`
  - Volunteers create applications.
  - Admins/organizers can update status; organizer restricted to own events.
  - Creates notifications for admins on new application and for volunteer on status change.
- `DocumentController`
  - Volunteers upload docs (`pdf/jpg/jpeg/png`, max 5MB) to `public` disk.
  - Admin reviews documents and may set rejection reason.
  - Review action notifies volunteer.
- `HourController`
  - Volunteers submit hours; admin approves.
  - Leaderboard aggregates approved hours by volunteer.
- `NotificationController`
  - User-specific paginated list.
  - Mark one or all as read.

### 4.5 API surface (`routes/api.php`)

Public:

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`

Authenticated (`auth:sanctum`):

- Events: list/create/show/update/delete
- Applications: list/create/update status
- Documents: list/upload/review
- Hours: leaderboard/list/create/approve
- Notifications: list/mark-one-read/mark-all-read

Role-specific route guards:

- Delete event: admin
- Update application status: admin or organizer
- Review document: admin
- Approve hours: admin

## 5) Database schema and seed data

### 5.1 Main tables (from migrations)

- `users`: includes enum role `admin|volunteer|organizer`.
- `volunteers`: profile extension table keyed by `user_id`.
- `events`: event metadata + `created_by` organizer/admin reference.
- `applications`: `event_id`, `volunteer_id`, status (`pending|approved|rejected|completed`).
- `documents`: volunteer files with `type` and review status.
- `hours`: volunteer event hours with approval status.
- `notifications`: message + read flag by user.
- `personal_access_tokens`: Sanctum token table (available even though UI uses session cookies).
- Laravel defaults: `sessions`, `password_reset_tokens`.

### 5.2 Seeder behavior (`database/seeders/DatabaseSeeder.php`)

Creates:

- 3 users:
  - `admin@volunteerflow.com` (admin)
  - `volunteer@test.com` (volunteer)
  - `organizer@test.com` (organizer)
- Volunteer profile row for the volunteer user.
- 5 organizer-owned events across categories.
- 2 sample applications for the volunteer.
- 2 starter notifications.

This seeded data is used by existing feature smoke tests.

## 6) Frontend details (`client/`)

### 6.1 Core dependencies

From `client/package.json`:

- React 18, React Router 6
- TypeScript
- Vite 5
- Tailwind CSS
- Axios
- TanStack Query
- Recharts

### 6.2 Runtime and networking

- `client/src/lib/axios.ts` sets:
  - `baseURL: '/api'`
  - `withCredentials: true`
  - JSON headers
  - Request interceptor that fetches `/sanctum/csrf-cookie` for mutating methods (`POST/PUT/PATCH/DELETE`).
- `client/vite.config.ts` proxies `/api` and `/sanctum` to backend on `127.0.0.1:18080`.

### 6.3 App composition

- Entry: `client/src/main.tsx`
  - Wraps app in `BrowserRouter`, `QueryClientProvider`, `AuthProvider`.
- Routing: `client/src/App.tsx`
  - Public: `/`, `/login`, `/register`
  - Protected branches:
    - `/admin/*`
    - `/volunteer/*`
    - `/organizer/*`
  - Catch-all redirects users to role dashboard (or landing if unauthenticated).

### 6.4 Auth state

`AuthContext`:

- On mount calls `GET /api/me` to hydrate current session user.
- Exposes `login`, `register`, `logout`.
- Holds `user` and `isLoading`.

`ProtectedRoute`:

- Shows spinner while auth loads.
- Redirects unauthenticated users to `/login`.
- Redirects role mismatch users to their own dashboard.

### 6.5 Shared layout/UI

`AppLayout`:

- Collapsible sidebar navigation computed from current role.
- Header with app title, notification bell, user name, logout button.
- Role-aware nav links.

`NotificationBell`:

- Fetches `/api/notifications` via React Query.
- Displays unread count and recent 5 notifications.
- Calls `PATCH /api/notifications/read-all` and invalidates query.

### 6.6 Current page implementation status

Implemented with mostly static/demo content:

- `admin/Dashboard.tsx` (includes real `GET /api/me` query + static KPI/chart/table data).
- `organizer/Dashboard.tsx` (static dashboard content).
- `volunteer/Dashboard.tsx` (static dashboard content).
- Landing, Login, Register are functional UI (auth calls are real).

Placeholders (UI shell present, API wiring not yet implemented):

- Admin: `Volunteers`, `Events`, `Documents`, `Analytics`
- Organizer: `Events`, `Volunteers`
- Volunteer: `Profile`, `Events`, `Documents`, `Hours`

## 7) Testing and quality

- Test framework: PHPUnit (`phpunit.xml` includes `tests/Feature`).
- Existing feature test file: `tests/Feature/ApiSmokeTest.php`
  - CSRF endpoint responds.
  - `/api/me` works for authenticated user.
  - Notifications endpoint shape.
  - Hours leaderboard shape.
  - Organizer forbidden from updating applications for non-owned events.

Notable: many backend endpoints currently lack dedicated automated tests beyond smoke-level coverage.

## 8) Local development workflow

Backend (from repo root):

- Install deps: `composer install`
- Configure env: copy `.env.example` -> `.env`
- Generate key: `php artisan key:generate`
- Migrate and seed: `php artisan migrate --seed`
- Run backend: `php artisan serve --host=127.0.0.1 --port=18080`

Frontend (from `client/`):

- Install deps: `npm install`
- Run dev server: `npm run dev -- --port 5173`

Then open `http://localhost:5173`.

## 9) Important environment assumptions

From `.env.example`:

- `SESSION_DOMAIN=localhost`
- `SANCTUM_STATEFUL_DOMAINS=localhost:5173`
- `FRONTEND_URL=http://localhost:5173`

These values are important for cookie auth to work from frontend to backend in local development.

## 10) Known implementation gaps and risks

- Frontend is only partially integrated with backend; many pages are placeholders.
- Public `POST /api/logout` and `GET /api/me` exist outside auth middleware; behavior is controlled in controller logic.
- Event delete route is admin-only even though controller does not re-check role (enforced by route middleware).
- Documentation uploads rely on Laravel `public` disk URL generation; deployment must expose storage symlink.
- Minimal test coverage for authorization matrix and validation edge cases.

## 11) Quick “how to extend” guide for LLMs

When implementing new features:

1. Start from API route in `routes/api.php`.
2. Add/update controller methods in `app/Http/Controllers`.
3. Update model relations/fillables/casts if schema semantics changed.
4. Add migration + seeder updates when introducing data model changes.
5. Wire frontend page in `client/src/pages/*` using `api` client + React Query.
6. Keep role restrictions consistent in both backend route middleware and frontend routing/UX.
7. Add feature tests in `tests/Feature` for auth/role/validation behavior.

## 12) Canonical files for fast orientation

Backend:

- `routes/api.php`
- `bootstrap/app.php`
- `app/Http/Controllers/*.php`
- `app/Models/*.php`
- `database/migrations/*.php`
- `database/seeders/DatabaseSeeder.php`
- `tests/Feature/ApiSmokeTest.php`

Frontend:

- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/context/AuthContext.tsx`
- `client/src/lib/axios.ts`
- `client/src/layouts/AppLayout.tsx`
- `client/src/components/ProtectedRoute.tsx`
- `client/src/components/NotificationBell.tsx`
- `client/src/pages/**/*`

