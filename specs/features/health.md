# Feature — Health Check

## Objetivo

Permitir que clientes, balanceadores de carga y plataformas de orquestación puedan verificar rápidamente si el servicio está disponible.

---

## Endpoint

GET /health

---

## Autenticación

No requiere autenticación.

Debe ser accesible públicamente.

---

## Respuesta

Código HTTP:

```

200 OK

```

Body:

```json
{
  "status": "UP",
  "service": "auth-service",
  "version": "1.0.0",
  "timestamp": "2026-07-07T17:30:11.312Z",
  "uptime": 10543.82
}
```

---

## Campos

| Campo | Descripción |
|--------|-------------|
| status | Estado del servicio |
| service | Nombre del servicio |
| version | Versión actual |
| timestamp | Fecha y hora de la respuesta |
| uptime | Tiempo desde el inicio del proceso (segundos) |

---

## Comportamiento

El endpoint únicamente valida que la aplicación se encuentre ejecutándose.

No realiza verificaciones sobre:

- Base de datos
- Redis
- Kafka
- APIs externas

Estas validaciones corresponderán a un endpoint de readiness o un health check avanzado en futuras iteraciones.

---

## Tiempo de respuesta

El endpoint debe responder en menos de 100 ms bajo condiciones normales.

---

## Casos de uso

Puede ser utilizado por:

- Kubernetes Liveness Probe
- Kubernetes Readiness Probe (implementación básica)
- Load Balancers
- API Gateway
- Sistemas de monitoreo

---

## Ejemplo

Solicitud

```
GET /health
```

Respuesta

```json
{
  "status": "UP",
  "service": "auth-service",
  "version": "1.0.0",
  "timestamp": "2026-07-07T17:30:11.312Z",
  "uptime": 10543.82
}
```

---

## Criterios de aceptación

- Devuelve HTTP 200.
- No requiere autenticación.
- Incluye la información del servicio.
- Incluye el uptime del proceso.
- Responde en menos de 100 ms.
- Puede ser utilizado por Kubernetes como liveness probe.