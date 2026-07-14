# Despliegue en el VPS de Contabo

Guía para publicar Tecnocar N&S en el VPS (83.171.248.249), que ya tiene **Traefik** (proxy inverso) y **Portainer** corriendo de un proyecto anterior. Este proyecto se integra a ese Traefik existente en vez de instalar un proxy propio.

Subdominios:
- `tecnocar.byronrm.com` → frontend
- `backtec.byronrm.com` → backend (API)
- `pgtec.byronrm.com` → Adminer (administración de la base de datos)
- `portainertec.byronrm.com` → Portainer (ya existente, fuera de este proyecto)

> ⚠️ Traefik en este VPS solo tiene el entrypoint `web` (puerto 80, HTTP). No hay HTTPS/Let's Encrypt configurado todavía. Por eso el sitio queda en `http://` por ahora — ver la sección "Agregar HTTPS" al final para la opción de subir eso a Traefik (afecta la configuración compartida, así que es un paso aparte y deliberado).

## Cómo se despliega

Ya está automatizado con GitHub Actions (`.github/workflows/deploy.yml`): cada `git push` a `main` copia el proyecto a `/opt/tecnocar` en el VPS y corre `docker compose up -d --build`. Los pasos de abajo son para el primer despliegue / referencia.

Secrets ya configurados en GitHub (Settings → Secrets and variables → Actions):
`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `POSTGRES_PASSWORD`, `JWT_SECRET`.

## 1. Red de Traefik

El `docker-compose.yml` espera una red externa llamada `traefik` (la misma que ya usa el Traefik existente). Ya existe en este VPS — no hay que crearla.

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
FRONTEND_URL=http://tecnocar.byronrm.com
BACKEND_URL=http://backtec.byronrm.com
FRONTEND_DOMAIN=tecnocar.byronrm.com
BACKEND_DOMAIN=backtec.byronrm.com
ADMINER_DOMAIN=pgtec.byronrm.com
```

## 3. Levantar el stack (lo hace el workflow automáticamente)

```bash
docker compose up -d --build
```

Levanta `postgres`, `backend`, `frontend` y `adminer`, cada uno con labels de Traefik para enrutar su subdominio. El backend aplica las migraciones de Prisma automáticamente al iniciar.

## 4. Cargar los datos iniciales

El workflow ya corre esto después de cada despliegue (es seguro repetirlo, no duplica datos):

```bash
docker compose exec backend npx prisma db seed
```

Crea:
- Usuario admin: **admin@tecnocar.com** / **Tecnocar2026!** (⚠️ cámbialo, ver paso 5).
- Las 6 categorías del catálogo.
- 6 productos de ejemplo con imagen de marcador de posición (reemplázalas subiendo fotos reales desde el panel admin → Productos).

## 5. Verificación

- `http://tecnocar.byronrm.com` — el sitio, navega productos, agrega al carrito, haz un pedido de prueba.
- `http://backtec.byronrm.com/api/docs` — Swagger de la API.
- `http://tecnocar.byronrm.com/login` — inicia sesión con el admin, entra a `/admin`. Cambia la contraseña creando un nuevo usuario admin desde Usuarios (no hay pantalla de "cambiar mi contraseña" en esta versión).
- `http://pgtec.byronrm.com` — Adminer; conecta con sistema `PostgreSQL`, servidor `postgres`, tus credenciales del `.env`.

## Agregar HTTPS (opcional, toca la configuración compartida de Traefik)

Esto edita `/opt/traefik/traefik.yml` y su `docker-compose.yml`, que también sirve tu proyecto anterior — hazlo con cuidado (o pregunta a tu tutor si el VPS es compartido con más gente):

1. Agrega un entrypoint `websecure` (443) + un `certificatesResolver` de Let's Encrypt en `traefik.yml`.
2. Publica el puerto 443 en `/opt/traefik/docker-compose.yml` y monta un volumen para `acme.json`.
3. Agrega labels `traefik.http.routers.<x>.tls.certresolver=<resolver>` a los servicios de este proyecto (backend, frontend, adminer) en su `docker-compose.yml`.
4. Cambia `FRONTEND_URL`/`BACKEND_URL` en los secrets/`.env` a `https://`.

Si quieres, dime y te preparo exactamente esos cambios cuando estés listo.

## Mantenimiento

- **Ver logs:** `docker compose logs -f backend` (o `frontend`, `postgres`) desde `/opt/tecnocar`.
- **Redeploy manual:** `docker compose up -d --build` desde `/opt/tecnocar`, o simplemente `git push` a `main`.
- **Backup de la base de datos:** `docker compose exec postgres pg_dump -U postgres tecnocar > backup.sql`.
- **Imágenes de productos** se guardan en el volumen `backend_uploads`; no se pierden al reconstruir contenedores, solo si borras el volumen.
