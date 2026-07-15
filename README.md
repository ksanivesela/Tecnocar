# Tecnocar N&S

Aplicación web para el taller y tienda de repuestos automotrices Tecnocar N&S: catálogo de productos, compras, reservas de servicio, contacto y un panel de administración completo.

🔗 **Sitio en producción:** https://tecnocar.byronrm.com

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + TailwindCSS + Zustand + React Router |
| Backend | NestJS 11 + Prisma 7 + PostgreSQL |
| Auth | JWT (roles ADMIN / CLIENTE) |
| Infraestructura | Docker, Traefik (proxy inverso + HTTPS), GitHub Actions (CI/CD) |

## Funcionalidades

**Sitio público**
- Catálogo de productos con filtro por categoría y búsqueda.
- Carrito de compras y checkout como invitado (sin necesidad de cuenta).
- Formulario de reservas de servicio y formulario de contacto.

**Panel admin** (`/admin`, requiere login con rol ADMIN)
- Dashboard con estadísticas, ingresos mensuales e inventario.
- CRUD de productos con subida de imágenes.
- Gestión de reservas y pedidos (cambio de estado).
- Listado de usuarios/clientes.

## Estructura del proyecto

```
backend/    API NestJS + Prisma (schema, migraciones, seed)
frontend/   SPA React (páginas públicas + panel admin)
docs/       Guía de despliegue (docs/DEPLOY.md)
.github/    Workflow de CI/CD (build, push a GHCR, deploy al VPS)
```

## Ejecutar en local

Requiere Node 24+, Docker y npm.

```bash
# 1. Base de datos
docker run -d --name tecnocar-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tecnocar -p 5433:5432 postgres:16-alpine

# 2. Backend
cd backend
cp .env.example .env      # ajusta si es necesario
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev         # http://localhost:3000/api

# 3. Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

**Credenciales de admin por defecto** (seed): `admin@tecnocar.com` / `Tecnocar2026!` 

## Arquitectura de despliegue

El proyecto corre en un VPS junto con otros servicios (Portainer, Traefik ya existentes), por lo que **no** trae su propio proxy — se integra al Traefik del servidor mediante labels de Docker.

```
Internet → Traefik (443, Let's Encrypt) → { frontend (nginx) | backend (Nest) | adminer } → PostgreSQL
```

| Subdominio | Servicio |
|---|---|
| `tecnocar.byronrm.com` | Frontend |
| `backtec.byronrm.com` | Backend (API + Swagger en `/api/docs`) |
| `pgtec.byronrm.com` | Adminer (administración de la base de datos) |
| `portainertec.byronrm.com` | Portainer (gestión de contenedores) |

Traefik enruta cada contenedor por su label `traefik.http.routers.<nombre>.rule=Host(...)`, usando la red externa `traefik`. El entrypoint `web` (80) redirige automáticamente a `websecure` (443); los certificados SSL se emiten y renuevan solos vía Let's Encrypt (challenge HTTP-01).

### CI/CD (GitHub Actions)

Cada `git push` a `main` dispara `.github/workflows/deploy.yml`, que:
1. Construye las imágenes de backend y frontend y las publica en GitHub Container Registry (`ghcr.io/ksanivesela/tecnocar-backend`, `-frontend`).
2. Copia el proyecto al VPS (`/opt/tecnocar`) y corre `docker compose up -d --build`.
3. Aplica las migraciones de Prisma y el seed automáticamente.

No requiere pasos manuales para desplegar — solo hacer push.

### Variables de entorno

Ver `.env.example` (raíz, backend y frontend). En producción, las variables sensibles (`POSTGRES_PASSWORD`, `JWT_SECRET`, credenciales SSH del VPS) se guardan como **Secrets** en GitHub, no en el repositorio.

📄 **Guía completa de despliegue e infraestructura:** [`docs/DEPLOY.md`](docs/DEPLOY.md)
