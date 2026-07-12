# Task 004 — Record HTTP 500 Metrics

## Objetivo

Corregir la instrumentación Prometheus para que las respuestas HTTP 500 generadas por errores no controlados se registren con `status_code="500"` en el contador y el histograma.

---

## Specs a leer

- `specs/features/instrumentation.md`
- `specs/api/openapi.yaml`
- `specs/docs/architecture.md`

No requiere cambios de API ni consultas de base de datos.

---

## Alcance

- Obtener el estado final de la respuesta después de que el middleware centralizado de errores la haya enviado.
- Resolver la etiqueta `route` a partir de la ruta de Express para que los 500 usen la misma serie que las respuestas exitosas.
- Registrar una sola vez `http_requests_total` y `http_request_duration_seconds` para una respuesta 500.
- Mantener la exclusión de `/auth/metrics`.
- No cambiar las etiquetas existentes: `method`, `route` y `status_code`.

---

## Archivos a actualizar

- `src/middleware/metrics.middleware.ts`
- `tests/unit/metrics.middleware.test.ts`
- `tests/integration/metrics.test.ts`
- `specs/features/instrumentation.md`

---

## Pruebas

### Unit

- El middleware registra `status_code="500"` al finalizar una respuesta de error.

### Integration

- Un error no controlado en `POST /auth/login` devuelve HTTP 500.
- El endpoint `/auth/metrics` contiene una serie de contador e histograma con `status_code="500"`.
- La serie se incrementa una sola vez.

---

## Criterios de aceptación

- Las respuestas 500 están presentes en ambas métricas HTTP.
- El estado registrado es el estado final devuelto al cliente.
- No se modifica el contrato OpenAPI ni se agregan endpoints.
- Las pruebas de la tarea y la compilación TypeScript pasan.
