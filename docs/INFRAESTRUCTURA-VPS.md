# Infraestructura compartida del VPS: Traefik y Portainer

Estos archivos **no están en este repositorio** — viven directamente en el VPS (`/opt/traefik/` y `/opt/portainer/`) porque son infraestructura compartida con otros proyectos del mismo servidor, no parte de la aplicación Tecnocar. Se documentan aquí para referencia y revisión.

## Traefik (proxy inverso + HTTPS)

Ubicación: `/opt/traefik/`

### `traefik.yml` (configuración estática)

```yaml
api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"
  traefik:
    address: ":8080"

certificatesResolvers:
  letsencrypt:
    acme:
      email: ksa.nivesela@yavirac.edu.ec
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false

log:
  level: INFO
```

- **`entryPoints`**: `web` (80) redirige automáticamente a `websecure` (443); `traefik` (8080) es solo para el dashboard.
- **`certificatesResolvers.letsencrypt`**: emite y renueva certificados SSL automáticamente (challenge HTTP-01, usando el propio puerto 80).
- **`providers.docker.exposedByDefault: false`**: ningún contenedor se enruta a menos que tenga la label `traefik.enable=true` explícita — así Traefik no expone por accidente contenedores de otros proyectos en el VPS.

### `docker-compose.yml`

```yaml
services:
  traefik:
    image: traefik:v3.6
    container_name: traefik
    restart: unless-stopped
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --api.dashboard=true
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.websecure.address=:443
      - --entrypoints.traefik.address=:8080
      - --certificatesresolvers.letsencrypt.acme.email=ksa.nivesela@yavirac.edu.ec
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=PathPrefix(`/dashboard`) || PathPrefix(`/api`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.entrypoints=traefik"
      - "traefik.http.routers.dashboard.middlewares=dashboard-auth"
      - "traefik.http.middlewares.dashboard-auth.basicauth.users=admin:$$apr1$$..."

networks:
  traefik:
    external: true
```

- Monta el **socket de Docker** (solo lectura) para descubrir contenedores automáticamente por sus labels.
- El **dashboard** (`http://83.171.248.249:8080/dashboard/`) queda protegido con usuario/contraseña (Basic Auth) — antes estaba abierto sin login (`api.insecure=true`), se corrigió.
- `letsencrypt/acme.json` guarda los certificados emitidos; no debe borrarse ni commitearse (contiene claves privadas).
- Red externa `traefik`: la comparten todos los proyectos que Traefik debe enrutar (incluido este).

### Cómo se conecta cada servicio (ejemplo real, del backend de Tecnocar)

```yaml
networks:
  - traefik
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.tecnocar-backend.rule=Host(`backtec.byronrm.com`)"
  - "traefik.http.routers.tecnocar-backend.entrypoints=websecure"
  - "traefik.http.routers.tecnocar-backend.tls.certresolver=letsencrypt"
  - "traefik.http.services.tecnocar-backend.loadbalancer.server.port=3000"
```
Cada contenedor solo necesita unirse a la red `traefik` y declarar estas 5 labels — Traefik hace el resto (descubrimiento, ruteo por dominio, TLS).

## Portainer (gestión visual de Docker)

Ubicación: `/opt/portainer/`

```yaml
services:
  portainer:
    image: portainer/portainer-ce:lts
    container_name: portainer
    restart: unless-stopped
    command:
      - --no-setup-token
    ports:
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainertec.byronrm.com`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls.certresolver=letsencrypt"
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"

volumes:
  portainer_data:
    external: true
networks:
  traefik:
    external: true
```

- `--no-setup-token`: permite crear el usuario admin directo desde la interfaz web (ventana de 5 minutos tras un arranque con datos vacíos), sin necesitar un token impreso en los logs.
- Publica **9443** directo al host (acceso alterno por IP, `https://83.171.248.249:9443`) además del acceso por subdominio vía Traefik (puerto interno 9000, HTTP).
- `portainer_data` (volumen): guarda usuarios, entornos y configuración de Portainer — no los contenedores del VPS en sí. Si se resetea, solo hay que recrear el usuario admin, ningún contenedor de ningún proyecto se ve afectado.

## Resumen de la relación entre todo

```
Internet
  │
  ▼
Traefik (:80 → :443, Let's Encrypt)
  │
  ├── tecnocar.byronrm.com     → frontend (Tecnocar)
  ├── backtec.byronrm.com      → backend (Tecnocar)
  ├── pgtec.byronrm.com        → adminer (Tecnocar)
  └── portainertec.byronrm.com → portainer (independiente, gestiona todo Docker del VPS)
```

Traefik y Portainer ya existían en el VPS antes de este proyecto (de un curso anterior); Tecnocar se integró a ellos en vez de instalar su propio proxy, para no duplicar infraestructura ni pisar el puerto 80/443.
