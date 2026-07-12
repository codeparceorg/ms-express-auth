# Feature — Application Instrumentation

## Objetivo

Recopilar métricas en memoria sobre el comportamiento HTTP y del proceso para facilitar el monitoreo operativo del servicio.

---

## Métricas recopiladas

Por cada solicitud no excluida se deben registrar:

- total de solicitudes procesadas;
- solicitudes agrupadas por método, ruta y código HTTP;
- duración total y duración máxima en milisegundos;
- cantidad de solicitudes 4xx y 5xx.

También se debe exponer el tiempo de actividad del proceso y el uso de memoria actual.

No se deben recolectar cuerpos, contraseñas, tokens, correos ni otros datos personales.

---

## Endpoint

GET /metrics

No requiere autenticación. Devuelve `application/json` con las métricas acumuladas desde el inicio del proceso.

### Respuesta 200

```json
{
  "requests": {
    "total": 12,
    "clientErrors": 2,
    "serverErrors": 1,
    "durationMs": {
      "total": 410,
      "max": 89
    },
    "byRoute": [
      { "method": "POST", "path": "/auth/login", "status": 200, "count": 8 }
    ]
  },
  "process": {
    "uptimeSeconds": 523.41,
    "memory": {
      "rssBytes": 73400320,
      "heapUsedBytes": 25165824
    }
  }
}
```

---

## Exclusiones

Las solicitudes a `/health`, `/metrics`, `/favicon.ico` y archivos estáticos no deben alterar las métricas HTTP.

---

## Criterios de aceptación

- Todas las solicitudes HTTP no excluidas actualizan las métricas al finalizar, incluyendo 4xx y 5xx.
- `GET /metrics` devuelve HTTP 200 y JSON válido sin autenticación.
- La respuesta no contiene datos sensibles ni identificadores de usuario.
- La instrumentación no modifica el contrato de los endpoints de autenticación.
