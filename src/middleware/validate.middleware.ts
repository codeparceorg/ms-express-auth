import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.reduce(
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
    req.body = result.data;
    next();
  };
}
