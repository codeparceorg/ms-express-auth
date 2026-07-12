# Backend — Visión

## Propósito

Servicio de autenticacion moderno.

Su función es exponer una API REST que permita al Frontend React autenticarse para realizar operaciones bancarias básicas de forma segura, confiable y auditable.

---

## Alcance

### Dentro del alcance

- Autenticación de usuarios (Login, Signup, Refresh Token, JWT)
- Instrumentación operativa de solicitudes y proceso

### Fuera del alcance

- Codigo OTP
- Biometrico

---

## Principios

1. **API First:** Todos los endpoints están definidos en el contrato antes de implementar.
2. **Seguridad por defecto:** JWT, contraseñas hasheadas, validación en cada endpoint.

---

## Stack tecnológico (propuesto)

| Componente    | Tecnología            |
| ------------- | --------------------- |
| Lenguaje      | Node.js + TypeScript  |
| Framework     | Express.js            |
| Base de datos | PostgreSQL 17+        |
| Driver DB     | pg (node-postgres)    |
| Autenticación | jsonwebtoken          |
| Hash          | bcrypt                |
| Validación    | zod o class-validator |
| Testing       | Jest + Supertest      |
| Documentación | OpenAPI 3.1           |
