# Backend — Arquitectura

---

## Capas

La aplicación sigue una arquitectura limpia en capas:

```
┌─────────────────────────────────────────────┐
│               HTTP / Router                  │
│        (Express / NestJS)                    │
├─────────────────────────────────────────────┤
│              Middleware                      │
│   (Auth, Validation, Error Handler, CORS)   │
├─────────────────────────────────────────────┤
│              Controllers                    │
│  (Manejo de request/response, DTO mapping)  │
├─────────────────────────────────────────────┤
│               Services                      │
│     (Lógica de negocio, reglas, orquestación)│
├─────────────────────────────────────────────┤
│              Repositories                   │
│        (Acceso a datos, consultas SQL)      │
├─────────────────────────────────────────────┤
│                Database                     │
│           (PostgreSQL 17+)                  │
└─────────────────────────────────────────────┘
```

---

## Flujo de una request

```
Request HTTP
    ↓
Router → Middleware (auth, validación)
    ↓
Controller (parsea body/params, llama al servicio)
    ↓
Service (valida reglas de negocio, llama al repositorio)
    ↓
Repository (ejecuta SQL, devuelve datos)
    ↓
Service (mapea resultado, aplica lógica si aplica)
    ↓
Controller (arma response DTO, devuelve JSON)
    ↓
Response HTTP
```

---

## Routing

| Método | Path               | Feature        | Auth requerido |
|--------|--------------------|----------------|----------------|
| POST   | /auth/login        | Authentication | No             |
| POST   | /auth/signup       | Authentication | No             |
| POST   | /auth/refresh      | Authentication | No             |


---

## Estructura de carpetas (propuesta)

```
src/
├── controllers/
│   ├── auth.controller.ts
├── services/
│   ├── auth.service.ts
├── repositories/
│   └── auth-token.repository.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validate.middleware.ts
│   └── error-handler.middleware.ts
├── dto/
│   ├── auth.dto.ts
│   ├── user.dto.ts
├── entities/
│   └── auth-token.entity.ts
├── validators/
│   ├── auth.validator.ts
│   ├── user.validator.ts
├── config/
│   └── database.ts
├── routes/
│   └── index.ts
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   └── errors.ts
└── app.ts
```

---

## Dependencias entre módulos

```
Authentication ──→ Users
     │
     ├──→ RefreshTokens
```

Cada módulo es independiente. No existen dependencias circulares.
