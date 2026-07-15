# Despliegue en el VPS de Contabo

Guía para publicar Tecnocar N&S en el VPS (83.171.248.249), que ya tiene **Traefik** (proxy inverso, con HTTPS/Let's Encrypt) y **Portainer** corriendo de un proyecto anterior. Este proyecto se integra a ese Traefik existente en vez de instalar un proxy propio.

Subdominios (todos con HTTPS):
- `tecnocar.byronrm.com` → frontend
- `backtec.byronrm.com` → backend (API)
- `pgtec.byronrm.com` → Adminer (administración de la base de datos)
- `portainertec.byronrm.com` → Portainer (ya existente, fuera de este proyecto)

## Cómo se despliega

Ya está automatizado con GitHub Actions (`.github/workflows/deploy.yml`): cada `git push` a `main` copia el proyecto a `/opt/tecnocar` en el VPS y corre `docker compose up -d --build`. Los pasos de abajo son para el primer despliegue / referencia.

Secrets ya configurados en GitHub (Settings → Secrets and variables → Actions):
`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `POSTGRES_PASSWORD`, `JWT_SECRET`.

## 1. Red de Traefik

El `docker-compose.yml` espera una red externa llamada `traefik` (la misma que ya usa el Traefik existente). Ya existe en este VPS — no hay que crearla.

Cada servicio (backend, frontend, adminer) usa el entrypoint `websecure` (443) con `tls.certresolver=letsencrypt`; Traefik pide el certificado automáticamente la primera vez que alguien llega a ese subdominio.

## 2. Variables de entorno en el VPS

El workflow escribe `/opt/tecnocar/.env` automáticamente en cada despliegue con los secrets de GitHub. Si alguna vez necesitas tocarlo a mano:

```bash
cd /opt/tecnocar
nano .env
```

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<el secret de GitHub>
POSTGRES_DB=tecnocar
JWT_SECRET=<el secret de GitHub>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tecnocar.byronrm.com
BACKEND_URL=https://backtec.byronrm.com
FRONTEND_DOMAIN=tecnocar.byronrm.com
BACKEND_DOMAIN=backtec.byronrm.com
ADMINER_DOMAIN=pgtec.byronrm.com
```

## 3. Levantar el stack (lo hace el workflow automáticamente)

```bash
docker compose up -d --build
```

Levanta `postgres`, `backend`, `frontend` y `adminer`, cada uno con labels de Traefik para enrutar su subdominio con HTTPS. El backend aplica las migraciones de Prisma automáticamente al iniciar.

## 4. Cargar los datos iniciales

El workflow ya corre esto después de cada despliegue (es seguro repetirlo, no duplica datos):

```bash
docker compose exec backend npx prisma db seed
```

Crea:
- Usuario admin: **admin@tecnocar.com** / **Tecnocar2026!** 
- Las 6 categorías del catálogo.
- 6 productos de ejemplo con imagen de marcador de posición (reemplázalas subiendo fotos reales desde el panel admin → Productos).

## 5. Verificación

- `https://tecnocar.byronrm.com` — el sitio, navega productos, agrega al carrito, haz un pedido de prueba.
- `https://backtec.byronrm.com/api/docs` — Swagger de la API.
- `https://tecnocar.byronrm.com/login` — inicia sesión con el admin, entra a `/admin`. Cambia la contraseña creando un nuevo usuario admin desde Usuarios (no hay pantalla de "cambiar mi contraseña" en esta versión).
- `https://pgtec.byronrm.com` — Adminer; conecta con sistema `PostgreSQL`, servidor `postgres`, tus credenciales del `.env`.

## Traefik: notas de la configuración compartida

Este VPS también corre otros servicios además de este proyecto. Cosas a tener en cuenta si vuelves a tocar `/opt/traefik/`:

- `traefik.yml` y `docker-compose.yml` ahí definen: entrypoints `web` (80, redirige a HTTPS), `websecure` (443), `traefik` (8080, dashboard), y el resolver `letsencrypt` (HTTP challenge vía el entrypoint `web`).
- El dashboard (`http://83.171.248.249:8080/dashboard/`) requiere usuario/contraseña (Basic Auth vía Traefik).
- Los certificados se guardan en `/opt/traefik/letsencrypt/acme.json` — no se debe borrar sin necesidad, o habría que volver a pedir todos los certificados.
- Se removió un proyecto anterior (`devops-final-project`, desplegado como Docker Swarm stack) que competía por el puerto 80 — si vuelves a desplegar algo similar en Swarm con puerto publicado directo, puede volver a chocar con Traefik.

## Mantenimiento

- **Ver logs:** `docker compose logs -f backend` (o `frontend`, `postgres`) desde `/opt/tecnocar`.
- **Redeploy manual:** `docker compose up -d --build` desde `/opt/tecnocar`, o simplemente `git push` a `main`.
- **Backup de la base de datos:** `docker compose exec postgres pg_dump -U postgres tecnocar > backup.sql`.
- **Imágenes de productos** se guardan en el volumen `backend_uploads`; no se pierden al reconstruir contenedores, solo si borras el volumen.
