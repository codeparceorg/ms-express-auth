# Feature: Authentication

## Descripción

Permite a los usuarios registrarse e iniciar sesión en la aplicación mediante JWT.

---

## Endpoints

| Método | Path               | Auth | Descripción                          |
|--------|--------------------|------|--------------------------------------|
| POST   | /auth/signup       | No   | Registrar un nuevo usuario           |
| POST   | /auth/login        | No   | Iniciar sesión                       |
| POST   | /auth/refresh      | No   | Renovar access token                 |

---

## POST /auth/signup

### Request body
```json
{
  "email": "juan@email.com",
  "password": "Password123"
}
```

### Validaciones
- `email`: obligatorio, formato válido, único en DB
- `password`: obligatorio, mínimo 8 caracteres, debe incluir mayúscula, minúscula y número

### Response 201
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez"
  }
}
```

### Errores
| Status | Body                                          |
|--------|-----------------------------------------------|
| 400    | `{ "message": "El correo ya se encuentra registrado." }` |
| 500    | `{ "message": "Error interno del servidor" }` |

### Reglas de negocio
1. Verificar que el email no exista en `users`.
2. Generar `client_number` secuencial (formato `CLT-XXXXX`).
3. Hashear password con bcrypt (12 rondas).
4. Insertar en `auth_token`.
5. Generar accessToken (1 h) y refreshToken (7 días).
6. Guardar refreshToken hasheado en `refresh_tokens`.

---

## POST /auth/login

### Request body
```json
{
  "email": "cliente@correo.com",
  "password": "Password123"
}
```

### Validaciones
- `email`: obligatorio, formato válido
- `password`: obligatorio, mínimo 8 caracteres

### Response 200
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez"
  }
}
```

### Errores
| Status | Body                                          |
|--------|-----------------------------------------------|
| 401    | `{ "message": "Credenciales inválidas" }`    |
| 500    | `{ "message": "Error interno del servidor" }` |

### Reglas de negocio
1. Buscar usuario por email.
2. Comparar password con bcrypt.
3. Generar accessToken (15 min) y refreshToken (7 días).
4. Guardar refreshToken hasheado en `refresh_tokens`.

---

## POST /auth/refresh

### Request body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response 200
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Errores
| Status | Body                                          |
|--------|-----------------------------------------------|
| 401    | `{ "message": "Token inválido o expirado" }` |

### Reglas de negocio
1. Buscar token en `refresh_tokens`.
2. Validar que no esté revocado ni expirado.
3. Revocar token anterior.
4. Generar y guardar nuevo par de tokens.
