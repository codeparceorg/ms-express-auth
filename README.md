# ms-node-auth

Microservicio de autenticación desarrollado con Node.js, TypeScript y Express para registrar usuarios, iniciar sesión y renovar tokens JWT.

## Tecnologías

- Node.js + TypeScript
- Express.js
- JWT + bcryptjs
- PostgreSQL
- Jest + Supertest
- pnpm

## Versión

- Versión actual: 1.0.0

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL en ejecución

## Instalación

```bash
pnpm install
cp env.template .env
```

Ajusta las variables de entorno en `.env` si es necesario.

## Ejecución

### Desarrollo

```bash
pnpm dev
```

### Producción

```bash
pnpm build
pnpm start
```

## Estructura del proyecto

```text
src/
  controllers/
  services/
  repositories/
  routes/
  validators/
  middleware/
  utils/
 tests/
  integration/
  unit/
```

## Probar la API

El servicio queda expuesto en `http://localhost:8080` por defecto.

### Health check

```bash
curl http://localhost:8080/health
```

### Registro de usuario

```bash
curl --location 'http://localhost:8080/auth/signup' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "email": "cliente@correo.com",
    "password": "Password123"
  }'
```

### Login

```bash
curl --location 'http://localhost:8080/auth/login' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "email": "cliente@correo.com",
    "password": "Password123"
  }'
```

### Refresh token

```bash
curl --location 'http://localhost:8080/auth/refresh' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "refreshToken": "<refresh_token>"
  }'
```

## Pruebas

```bash
pnpm test
```
