# Task 001 — Auth Service

## Objetivo

Implementar el módulo de autenticación: registro, inicio de sesión, renovación de tokens y creacion del contrato del proyecto. 

---

## Specs a leer

- `specs/features/auth.md`
- `database/schema.sql` (tablas: auth_token)

---

## Endpoints

| Método | Path            | Descripción               |
|--------|-----------------|---------------------------|
| POST   | /auth/signup    | Registrar nuevo usuario   |
| POST   | /auth/login     | Iniciar sesión            |
| POST   | /auth/refresh   | Renovar access token      |

---

## Archivos a crear

```
src/
├── controllers/auth.controller.ts
├── services/auth.service.ts
├── repositories/refresh-token.repository.ts
├── middleware/auth.middleware.ts
├── validators/auth.validator.ts
├── dto/auth.dto.ts
├── utils/jwt.ts
├── utils/password.ts
└── routes/auth.routes.ts
```

---

## Dependencias npm

- `jsonwebtoken`
- `bcrypt`

---

## Validaciones

- Signup: email formato, password min 8 + mayúscula + minúscula + dígito
- Login: email formato, password min 8 chars
- Refresh: refreshToken obligatorio

---

## Reglas de negocio

- Email único (revisar en DB antes de insertar)
- Password hasheado con bcrypt (12 rounds)
- AccessToken expira en 1 hora
- RefreshToken expira en 7 días, almacenado en DB
- Al refrescar, revocar token anterior

---

## Pruebas

- Unit: auth.service.test.ts (mock repositories)
- Integration: POST /auth/signup, POST /auth/login, POST /auth/refresh
- Casos: éxito, email duplicado, credenciales inválidas, token expirado

---

## Criterios de aceptación

- POST /auth/signup crea usuario + cuenta checking por defecto
- POST /auth/login devuelve accessToken + refreshToken + user
- POST /auth/refresh renueva tokens
- Passwords no almacenados en texto plano
- Emails duplicados devuelven 400
- Credenciales incorrectas devuelven 401
- Creacion del contrato openapi.yaml del proyecto
