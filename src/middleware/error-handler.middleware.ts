import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.errors.reduce(
      (acc, e) => {
        const path = e.path.join('.');
        acc[path] = e.message;
        return acc;
      },
      {} as Record<string, string>,
    );
    res.status(400).json({ message: 'Error de validación.', errors });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
