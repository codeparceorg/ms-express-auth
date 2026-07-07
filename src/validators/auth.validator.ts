import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio.' })
    .email('Formato de email inválido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula.')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula.')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un dígito.'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio.' })
    .email('Formato de email inválido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'El refreshToken es obligatorio.' })
    .min(1, 'El refreshToken es obligatorio.'),
});
