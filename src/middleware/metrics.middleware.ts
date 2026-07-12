import { NextFunction, Request, Response } from 'express';
import { recordRequest } from '../services/metrics.service';

const EXCLUDED_PATHS = new Set(['/health', '/auth/health', '/metrics', '/favicon.ico']);

function isExcluded(path: string): boolean {
  return EXCLUDED_PATHS.has(path) || path.startsWith('/static/');
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const path = req.path;
  if (isExcluded(path)) {
    next();
    return;
  }

  const start = performance.now();
  res.on('finish', () => {
    recordRequest({
      method: req.method,
      path,
      status: res.statusCode,
      durationMs: Math.round(performance.now() - start),
    });
  });

  next();
}
