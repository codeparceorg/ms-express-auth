# Task 003 — Application Instrumentation

## Objetivo

Implementar instrumentación Prometheus para recopilar el comportamiento HTTP y del proceso, y exponerlo mediante un endpoint de métricas.

---

## Specs a leer

- `specs/features/instrumentation.md`
- `specs/api/openapi.yaml`
- `specs/docs/architecture.md`

No requiere cambios ni consultas de base de datos.

---

## Endpoint

| Método | Path | Descripción |
| --- | --- | --- |
| GET | /auth/metrics | Consultar métricas de comportamiento de la aplicación |

---

## Archivos a crear

```text
src/
├── controllers/metrics.controller.ts
├── middleware/metrics.middleware.ts
├── routes/metrics.routes.ts
└── services/metrics.service.ts
```

## Archivos a actualizar

- `src/routes/index.ts`
- `src/app.ts`
- `specs/api/openapi.yaml`
- `specs/docs/architecture.md`

## Dependencia npm

- `prom-client`

---

## Reglas de implementación

- Usar `prom-client` con un `Registry` dedicado.
- Registrar métricas predeterminadas del proceso con `collectDefaultMetrics`.
- Definir `http_requests_total` (Counter) y `http_request_duration_seconds` (Histogram).
- Etiquetar ambas métricas con `method`, `route` y `status_code`.
- Medir la duración con `process.hrtime` y los buckets 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2 y 5 segundos.
- Excluir únicamente `/auth/metrics` de la instrumentación para evitar autorreferencia.
- No incluir cuerpos, contraseñas, tokens, correos, IPs ni Request IDs en las etiquetas.
- Exponer el formato Prometheus con Content-Type `text/plain; version=0.0.4`.

---

## Pruebas

### Unit

- `metrics.service.test.ts`: registro Prometheus, etiquetas y métricas predeterminadas.
- `metrics.middleware.test.ts`: contador, histograma, duración y exclusión de `/auth/metrics`.

### Integration

- `GET /auth/metrics` responde 200, `text/plain` y sin autenticación.
- Una solicitud a una ruta instrumentada incrementa contador e histograma.
- La solicitud a `/auth/metrics` no se cuenta.

---

## Criterios de aceptación

- El endpoint está definido primero en OpenAPI.
- Las métricas describen solicitudes exitosas y con error sin filtrar información sensible mediante etiquetas de baja cardinalidad.
- El endpoint no altera contratos existentes.
- Unit tests, integration tests y compilación TypeScript finalizan correctamente.
