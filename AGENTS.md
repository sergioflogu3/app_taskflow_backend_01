# TaskFlow API — Agent Guide

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload (ts-node-dev) |
| `npm run build` | Compile TS → `dist/` |
| `npm start` | Run compiled output |

No test runner, linter, or formatter is configured.

## Setup

Copy `.env.example` → `.env`. Required vars:

- `DATABASE_URL` — PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/task_flow_backend`)
- `PORT` — server port (default 3000)
- `NODE_ENV` — defaults to `development`

`.env` is gitignored.

## Architecture

```
src/
  index.ts          — Express 5 app entry, middleware, 404 handler, app.listen
  config/
    database.ts     — pg.Pool singleton from DATABASE_URL
  routes/
    health.ts       — GET /health (queries PostgreSQL, returns status)
```

Build output lands in `dist/` (gitignored).

## Notable

- Express **5** (import path unchanged, but API surface differs from v4)
- TypeScript **6.0**, `commonjs` modules, `ES2020` target
- Single-package, not a monorepo
