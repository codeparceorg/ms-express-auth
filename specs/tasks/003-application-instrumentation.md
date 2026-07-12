# Task 003 — Application Instrumentation

## Objetivo

Implementar instrumentación en memoria para recopilar el comportamiento HTTP y del proceso, y exponerlo mediante un endpoint de métricas.

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
| GET | /metrics | Consultar métricas de comportamiento de la aplicación |

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

---

## Reglas de implementación

- Medir las solicitudes al finalizar la respuesta.
- Contabilizar método, ruta, código HTTP y duración en ms.
- Acumular totales, errores 4xx/5xx y duración total/máxima.
- Exponer uptime y memoria del proceso en bytes.
- Excluir `/health`, `/metrics`, `/favicon.ico` y archivos estáticos.
- No recolectar ni devolver cuerpos, contraseñas, tokens, correos, IPs ni Request IDs.
- Mantener las métricas en memoria; se reinician al reiniciar el proceso.

---

## Pruebas

### Unit

- `metrics.service.test.ts`: acumulación, agregación por ruta, errores y datos de proceso.
- `metrics.middleware.test.ts`: registro al finalizar y exclusiones.

### Integration

- `GET /metrics` responde 200 con JSON y sin autenticación.
- Una solicitud a una ruta instrumentada incrementa el contador.
- Solicitudes a `/health` y `/metrics` no se cuentan.

---

## Criterios de aceptación

- El endpoint está definido primero en OpenAPI.
- Las métricas describen solicitudes exitosas y con error sin filtrar información sensible.
- El endpoint no altera contratos existentes.
- Unit tests, integration tests y compilación TypeScript finalizan correctamente.
