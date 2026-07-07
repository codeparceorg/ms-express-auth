# Feature — Request Logging

## Objetivo

Registrar todas las peticiones HTTP que llegan al servicio para facilitar el monitoreo, depuración y auditoría.

---

## Descripción

El sistema debe registrar automáticamente todas las solicitudes HTTP mediante un middleware global.

Cada registro debe generarse al finalizar la petición para incluir el código de respuesta y el tiempo total de ejecución.

Los logs deben escribirse en formato JSON para facilitar su integración con herramientas como:

- Loki
- Elasticsearch
- Datadog
- CloudWatch
- Grafana

---

## Flujo

Cliente
↓
Request
↓
Request Logger Middleware
↓
Controller
↓
Response
↓
Registrar Log

---

## Información registrada

Cada petición debe contener como mínimo:

| Campo | Descripción |
|--------|-------------|
| timestamp | Fecha y hora ISO8601 |
| requestId | Identificador único de la petición |
| method | Método HTTP |
| path | Ruta solicitada |
| status | Código HTTP |
| duration | Tiempo de ejecución en ms |
| ip | Dirección IP del cliente |
| userAgent | User Agent |
| responseSize | Tamaño de la respuesta (si existe) |

---

## Ejemplo

```json
{
  "timestamp": "2026-07-07T17:20:10.211Z",
  "requestId": "req_01JHABCXYZ123",
  "method": "POST",
  "path": "/auth/login",
  "status": 200,
  "duration": 41,
  "ip": "192.168.0.15",
  "userAgent": "Mozilla/5.0",
  "responseSize": 542
}
```

---

## Request ID

Si la petición incluye el header

```

X-Request-Id

```

debe reutilizarse.

Si no existe, el sistema debe generar uno automáticamente.

El mismo Request ID debe devolverse al cliente en la respuesta.

---

## Exclusiones

No registrar:

- /health
- favicon.ico
- archivos estáticos

---

## Requisitos no funcionales

- El logger no debe afectar significativamente el tiempo de respuesta.
- Debe ser thread-safe.
- Debe funcionar para respuestas exitosas y errores.
- Debe registrar excepciones no controladas.

---

## Criterios de aceptación

- Todas las peticiones quedan registradas.
- Los logs tienen formato JSON.
- Se genera un Request ID cuando no existe.
- Se reutiliza el Request ID enviado por el cliente.
- El middleware registra también respuestas 4xx y 5xx.