# Despliegue en el VPS de Contabo

Guía paso a paso para publicar Tecnocar N&S en tu VPS (83.171.248.249) con tus subdominios:

- `tecnocar.byronrm.com` → frontend
- `backtec.byronrm.com` → backend (API)
- `pgtec.byronrm.com` → Adminer (administración de la base de datos)
- `portainertec.byronrm.com` → Portainer

## 0. Requisitos previos en el VPS

- Docker y Docker Compose instalados (`docker --version`, `docker compose version`).
- Portainer, si aún no lo tienes:
  ```bash
  docker volume create portainer_data
  docker run -d -p 8000:8000 --name portainer --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data portainer/portainer-ce:latest
  ```
- Los 4 subdominios ya apuntan (DNS tipo A) a `83.171.248.249` (confirmado).

## 1. Copiar el proyecto al VPS

Desde tu máquina, sube el proyecto (por `git` o `scp`) a una carpeta en el VPS, por ejemplo `/opt/tecnocar`.

```bash
# en el VPS
cd /opt
git clone <tu-repositorio> tecnocar
cd tecnocar
```

## 2. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Completa con valores **reales de producción**:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<clave-fuerte-y-unica>
POSTGRES_DB=tecnocar

JWT_SECRET=<cadena-larga-y-aleatoria>
JWT_EXPIRES_IN=7d

FRONTEND_URL=https://tecnocar.byronrm.com
BACKEND_URL=https://backtec.byronrm.com
```

## 3. Construir y levantar el stack

```bash
docker compose up -d --build
```

Esto levanta: `postgres`, `backend`, `frontend`, `adminer` y `nginx-proxy-manager` (puertos 80, 443 y 81).
El backend aplica las migraciones de Prisma automáticamente al iniciar.

## 4. Cargar los datos iniciales (una sola vez)

```bash
docker compose exec backend npx prisma db seed
```

Esto crea:
- Usuario admin: **admin@tecnocar.com** / **Tecnocar2026!** (⚠️ cámbialo apenas ingreses la primera vez, ver paso 6).
- Las 6 categorías del catálogo.
- 6 productos de ejemplo con una imagen de marcador de posición (reemplázalas subiendo fotos reales desde el panel admin → Productos).

## 5. Configurar Nginx Proxy Manager (proxy y HTTPS)

1. Entra a `http://83.171.248.249:81` (usuario/clave por defecto la primera vez: `admin@example.com` / `changeme` — Nginx Proxy Manager te pedirá cambiarla de inmediato).
2. Ve a **Proxy Hosts → Add Proxy Host** y crea uno por cada subdominio, todos apuntando al **nombre del servicio** (no a `localhost`), ya que Nginx Proxy Manager y los contenedores comparten la misma red de Docker:

| Domain Name | Forward Hostname / IP | Forward Port |
|---|---|---|
| tecnocar.byronrm.com | `frontend` | 80 |
| backtec.byronrm.com | `backend` | 3000 |
| pgtec.byronrm.com | `adminer` | 8080 |
| portainertec.byronrm.com | IP del host del VPS | 8000 |

3. En la pestaña **SSL** de cada uno: activa "Request a new SSL Certificate" (Let's Encrypt) + "Force SSL".

> `portainertec` apunta a Portainer, que corre fuera de este `docker-compose` (paso 0) — por eso se enruta por IP del host y no por nombre de servicio.

## 6. Verificación final

- `https://tecnocar.byronrm.com` — carga el sitio, navega productos, agrega al carrito y haz un pedido de prueba.
- `https://backtec.byronrm.com/api/docs` — Swagger de la API.
- `https://tecnocar.byronrm.com/login` — inicia sesión con el admin, entra a `/admin`, **cambia la contraseña del admin creando un nuevo usuario admin desde Usuarios y desactivando/cambiando la clave del original** (no hay pantalla de "cambiar mi contraseña" en esta versión; si la necesitas, pídemela y la agrego).
- `https://pgtec.byronrm.com` — Adminer; conecta con `postgres` / tus credenciales del `.env`.

## Mantenimiento

- **Ver logs:** `docker compose logs -f backend` (o `frontend`, `postgres`).
- **Actualizar tras un cambio de código:** `docker compose up -d --build backend` (o `frontend`).
- **Backup de la base de datos:** `docker compose exec postgres pg_dump -U postgres tecnocar > backup.sql`.
- **Imágenes de productos** se guardan en el volumen `backend_uploads`; no se pierden al reconstruir contenedores, solo si borras el volumen.
