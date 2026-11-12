# IncidentDesk

A multi-tenant incident and status platform built with Angular 19 (standalone components, signals, lazy routes, functional guards).

## Run
```bash
npm install
npm start          # http://localhost:4200
npm test
npm run build
docker compose up --build   # http://localhost:8080
```
Sign in with any name and pick a role: **admin**, **responder** or **viewer**. The public page is at `/status`.

## Structure
```
src/
  styles.css                  global tokens, typography, card, table, button, form styles
  app/
    core/                     models, services, guards, directives (no UI)
    shared/ui/                reusable presentational components
    features/<page>/          one folder per page: .ts .html .css .spec.ts
docs/adr/                     architecture decision records
.github/workflows/ci.yml      lint, test, build on every PR
```

## Decisions worth reading
- [ADR 0001: Signals and facades over NgRx](docs/adr/0001-signals-over-ngrx.md)
- [ADR 0002: Optimistic updates with rollback](docs/adr/0002-optimistic-updates.md)

## Roles
| Role | Dashboard / incidents | Create / change status | Settings |
|---|---|---|---|
| viewer | read | no | no |
| responder | read | yes | no |
| admin | read | yes | yes |

## Next steps
Replace the in-memory data in `IncidentService` with an HTTP client generated from an OpenAPI spec, add Playwright E2E, and move to an Nx workspace once a second app appears.
