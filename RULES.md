# Backend — Rules

---

## Código

- TypeScript estricto (strict: true en tsconfig.json)
- Sin `any`. Usar tipos explícitos.
- Máximo 200 líneas por archivo.
- Nombres en inglés para código, mensajes en español para el usuario.
- Funciones asíncronas con async/await (no promesas encadenadas).
- Manejo de errores centralizado (error-handler middleware).

---

## API

- Content-Type siempre `application/json`.
- Errores con formato: `{ "message": "descripción", "errors": {} }`
- Códigos HTTP semánticos (200, 201, 400, 401, 404, 500).

---

## Base de datos

- Usar pool de conexiones (pg.Pool).
- Prepared statements / parameterized queries. Sin concatenación de strings SQL.
- Los UUIDs se generan con gen_random_uuid() (PostgreSQL nativo).

---

## Seguridad

- JWT Access Token: expira en 15 minutos.
- JWT Refresh Token: expira en 7 días, almacenado en DB (hasheado).
- Passwords: bcrypt con 12 rondas de sal.

---

## Reglas de negocio (críticas)

| Regla                                               | Lugar de validación |
|-----------------------------------------------------|---------------------|
| Email único en signup                               | Service             |
| Password mínimo 8 caracteres                        | Validator           |

---

## Tests

- Unit tests: cada service de forma aislada (repositorios mockeados).
- Integration tests: endpoints reales con base de datos de prueba.
- Cobertura mínima: 80% en Services, 90% en Validators.
- Named con patrón: `*.test.ts`
