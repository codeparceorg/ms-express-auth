# Task 002 — Logging & Health Check

## Objetivo

Implementar un sistema de registro de peticiones HTTP mediante middleware y exponer un endpoint de verificación del estado del servicio (Health Check).

---

## Specs a leer

- `specs/features/logging.md`
- `specs/features/health.md`

---

## Endpoints

| Método | Path | Descripción |
|---------|------|-------------|
| GET | /health | Verificar estado del servicio |

---

## Archivos a crear

```text
src/
├── controllers/health.controller.ts
├── routes/health.routes.ts
├── middleware/request-logger.middleware.ts
├── services/health.service.ts
├── utils/logger.ts
└── types/request-context.ts
```

---

## Dependencias npm

- `pino`
- `pino-http`

---

## Registro de peticiones

Registrar automáticamente todas las solicitudes HTTP mediante un middleware.

### Información mínima a registrar

- Fecha y hora (ISO 8601)
- Método HTTP
- Ruta solicitada
- Código de respuesta
- Tiempo de ejecución (ms)
- Dirección IP del cliente
- User-Agent
- Request ID (generarlo si no existe)
- Tamaño de la respuesta (si está disponible)

### Excepciones

No registrar:

- `/health`
- Archivos estáticos (si existen)

### Formato

Logs estructurados en JSON.

Ejemplo:

```json
{
  "timestamp": "2026-07-07T15:42:18.321Z",
  "requestId": "req_01JABC123XYZ",
  "method": "POST",
  "path": "/auth/login",
  "status": 200,
  "duration": 32,
  "ip": "192.168.1.15",
  "userAgent": "Mozilla/5.0 ..."
}
```

---

## Health Check

El endpoint debe responder con el estado actual del servicio.

Respuesta esperada:

```json
{
  "status": "UP",
  "service": "auth-service",
  "version": "1.0.0",
  "timestamp": "2026-07-07T15:42:18.321Z",
  "uptime": 523.41
}
```

### Código de respuesta

- `200 OK` cuando el servicio esté disponible.

---

## Reglas de negocio

- El middleware debe ejecutarse antes de todas las rutas.
- Cada petición debe tener un Request ID único.
- El Request ID debe devolverse en la cabecera `X-Request-Id`.
- El tiempo de respuesta debe medirse desde que inicia hasta que finaliza la petición.
- Los errores (4xx y 5xx) también deben registrarse.
- El endpoint `/health` no requiere autenticación.

---

## Pruebas

### Unit

- `health.service.test.ts`
- `request-logger.middleware.test.ts`

### Integration

- `GET /health`
- Verificar que una petición genera un log.
- Verificar que se genera un Request ID.
- Verificar que `/health` no se registra en los logs.
- Verificar que las respuestas incluyen `X-Request-Id`.

---

## Criterios de aceptación

- Todas las peticiones HTTP quedan registradas en formato JSON.
- Los logs contienen método, ruta, IP, estado HTTP, duración y Request ID.
- El endpoint `GET /health` responde con estado `UP`.
- El endpoint responde en menos de **100 ms** bajo condiciones normales.
- El endpoint `/health` no requiere autenticación.
- Todas las respuestas incluyen la cabecera `X-Request-Id`.
- Los errores también quedan registrados en el sistema de logs.