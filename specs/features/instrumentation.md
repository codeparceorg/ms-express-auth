# Feature — Application Instrumentation

## Objetivo

Recopilar métricas Prometheus sobre el comportamiento HTTP y del proceso para facilitar el monitoreo operativo del servicio.

---

## Métricas recopiladas

Por cada solicitud HTTP se deben registrar:

- `http_requests_total`, agrupada por `method`, `route` y `status_code`;
- `http_request_duration_seconds`, como histograma por `method`, `route` y `status_code`;
- buckets de duración: 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2 y 5 segundos.

También se deben exponer las métricas predeterminadas del proceso de Node.js mediante `prom-client`.

No se deben recolectar cuerpos, contraseñas, tokens, correos ni otros datos personales.

---

## Endpoint

GET /auth/metrics

No requiere autenticación. Devuelve las métricas acumuladas desde el inicio del proceso en el formato de exposición Prometheus (`text/plain; version=0.0.4`).

### Respuesta 200

```text
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="POST",route="/login",status_code="200"} 8

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_count{method="POST",route="/login",status_code="200"} 8
```

---

## Exclusiones

La solicitud a `/auth/metrics` no debe instrumentarse para evitar que el endpoint se contabilice a sí mismo.

---

## Criterios de aceptación

- Todas las solicitudes HTTP, incluyendo 4xx y 5xx, actualizan las métricas al finalizar.
- `GET /auth/metrics` devuelve HTTP 200 y métricas Prometheus válidas sin autenticación.
- La respuesta no contiene cuerpos, credenciales, tokens ni datos personales.
- La instrumentación no modifica el contrato de los endpoints de autenticación.
