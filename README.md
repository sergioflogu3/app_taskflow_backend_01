# TaskFlow API

API REST para la gestión de tareas, construida con Express 5 + TypeScript + PostgreSQL + Prisma.

## Stack tecnológico

- **Node.js** — Entorno de ejecución
- **Express 5** — Framework web
- **TypeScript 6.0** — Lenguaje con tipado estático
- **PostgreSQL + Prisma** — Base de datos relacional y ORM
- **Swagger** — Documentación interactiva de la API
- **ts-node-dev** — Recarga automática en desarrollo

## Requisitos previos

- Node.js >= 18
- PostgreSQL corriendo localmente

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd taskflow-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Ejecutar migraciones de Prisma
npx prisma migrate dev

# 5. Iniciar en modo desarrollo
npm run dev
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | — |
| `NODE_ENV` | Entorno de ejecución | `development` |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor con recarga automática |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta la compilación producida |

## Estructura del proyecto

```
taskflow-api/
├── prisma/
│   └── schema.prisma         # Modelos de base de datos (User, Project, Task, Comment)
├── src/
│   ├── index.ts              # Punto de entrada, middlewares globales, rutas y listen
│   ├── config/
│   │   ├── database.ts       # Pool de conexión a PostgreSQL (pg)
│   │   ├── prisma.ts         # Instancia singleton de PrismaClient
│   │   └── swagger.ts        # Configuración de Swagger/OpenAPI
│   ├── routes/
│   │   ├── health.ts         # GET /health
│   │   ├── users.ts          # CRUD /api/users
│   │   └── projects.ts       # CRUD /api/projects
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   └── projects.controller.ts
│   ├── services/
│   │   ├── users.service.ts
│   │   └── projects.service.ts
│   └── types/
│       ├── users.types.ts
│       └── projects.types.ts
├── dist/                     # Compilación (gitignorado)
├── .env                      # Variables de entorno (gitignorado)
├── .env.example              # Plantilla de variables de entorno
├── .gitignore
├── AGENTS.md                 # Guía para agentes de IA
├── package.json
├── tsconfig.json
└── README.md
```

## Documentación interactiva

La API cuenta con documentación Swagger disponible en `/api-docs` una vez que el servidor esté corriendo.

## Endpoints

### `GET /`

Información general de la API.

```json
{
  "message": "TaskFlow API — Clase 1",
  "version": "1.0.0",
  "docs": "/api-docs"
}
```

### `GET /health`

Verifica que el servidor y la conexión a PostgreSQL estén funcionando.

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "message": "TaskFlow API funcionando correctamente",
  "database": {
    "status": "connected",
    "timestamp": "2026-06-23T..."
  },
  "environment": "development"
}
```

### `GET /api/users`

Lista todos los usuarios.

**Respuesta exitosa (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "createdAt": "date-time"
    }
  ],
  "count": 0
}
```

### `GET /api/users/:id`

Obtiene un usuario por su ID.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del usuario |

**Respuesta exitosa (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "createdAt": "date-time"
  }
}
```

### `POST /api/users`

Crea un nuevo usuario.

**Body (JSON):**
```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Respuesta exitosa (201):**
```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "createdAt": "date-time"
  }
}
```

### `PUT /api/users/:id`

Actualiza un usuario existente.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del usuario |

**Body (JSON):**
```json
{
  "name": "string",
  "email": "user@example.com"
}
```

### `DELETE /api/users/:id`

Elimina un usuario.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del usuario |

**Respuesta exitosa:** `204 No Content`

### `GET /api/projects`

Lista todos los proyectos.

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string | null",
      "ownerId": "uuid",
      "createdAt": "date-time"
    }
  ],
  "count": 0
}
```

### `GET /api/projects/:id`

Obtiene un proyecto por su ID.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del proyecto |

### `POST /api/projects`

Crea un nuevo proyecto.

**Body (JSON):**
```json
{
  "name": "string",
  "description": "string (opcional)",
  "ownerId": "uuid"
}
```

### `PUT /api/projects/:id`

Actualiza un proyecto existente.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del proyecto |

**Body (JSON):**
```json
{
  "name": "string",
  "description": "string (opcional)"
}
```

### `DELETE /api/projects/:id`

Elimina un proyecto.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string (uuid) | ID del proyecto |

**Respuesta exitosa:** `204 No Content`

## Modelo de datos

```prisma
model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  projects     Project[]
}

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime  @default(now())
  owner       User      @relation(fields: [ownerId], references: [id])
  tasks       Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  projectId   String
  assignedTo  String?
  createdAt   DateTime   @default(now())
  project     Project    @relation(fields: [projectId], references: [id])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  CANCELLED
}
```

## Lo que se ha implementado

- [x] Configuración inicial del proyecto con TypeScript
- [x] Servidor Express 5 con middlewares globales (CORS, JSON, URL-encoded)
- [x] Pool de conexión a PostgreSQL
- [x] Prisma ORM con migraciones
- [x] Endpoint `GET /health` con verificación de base de datos
- [x] Endpoint `GET /` con información de la API
- [x] Documentación Swagger en `/api-docs`
- [x] CRUD de usuarios (`/api/users`)
- [x] CRUD de proyectos (`/api/projects`)
- [ ] CRUD de tareas (pendiente)
- [ ] Autenticación y autorización (pendiente)
