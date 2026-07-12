import { NextFunction, Request, Response } from 'express';
import { recordHttpRequest } from '../services/metrics.service';

const METRICS_PATH = '/auth/metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === METRICS_PATH) {
    next();
    return;
  }

  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const elapsedNanoseconds = process.hrtime.bigint() - start;
    const durationSeconds = Number(elapsedNanoseconds) / 1_000_000_000;

    recordHttpRequest(
      {
        method: req.method,
        route: req.path,
        status_code: res.statusCode.toString(),
      },
      durationSeconds,
    );
  });

  next();
}
