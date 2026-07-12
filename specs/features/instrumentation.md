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

## Captura de errores no controlados (HTTP 500)

Cuando un handler de ruta lanza una excepción no controlada, el middleware centralizado de errores (`errorHandler`) envía una respuesta HTTP 500. El middleware de métricas registra el estado final **después** de que el error handler ha enviado la respuesta, usando el evento `finish` de Express.

La etiqueta `route` se resuelve a partir de `req.route.path` (la ruta definida en Express) para que las respuestas 500 usen la misma serie que las respuestas exitosas del mismo endpoint.

Cada respuesta 500 genera exactamente **un** registro en `http_requests_total` y **un** registro en `http_request_duration_seconds`.

---

## Criterios de aceptación

- Todas las solicitudes HTTP, incluyendo 4xx y 5xx, actualizan las métricas al finalizar con el estado final enviado al cliente.
- Las respuestas 500 generadas por errores no controlados se registran con `status_code="500"` en ambas métricas.
- La etiqueta `route` de una respuesta 500 corresponde a la misma ruta que las respuestas exitosas del mismo endpoint.
- `GET /auth/metrics` devuelve HTTP 200 y métricas Prometheus válidas sin autenticación.
- La respuesta no contiene cuerpos, credenciales, tokens ni datos personales.
- La instrumentación no modifica el contrato de los endpoints de autenticación.
