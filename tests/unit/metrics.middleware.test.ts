import { NextFunction, Request, Response } from 'express';
import { metricsMiddleware } from '../../src/middleware/metrics.middleware';
import { getMetrics, resetMetrics } from '../../src/services/metrics.service';

describe('metrics.middleware', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('registra una solicitud cuando la respuesta finaliza', () => {
    const listeners = new Map<string, () => void>();
    const req = { method: 'POST', path: '/auth/login' } as unknown as Request;
    const res = {
      statusCode: 401,
      on: jest.fn((event: string, listener: () => void) => {
        listeners.set(event, listener);
        return res;
      }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    metricsMiddleware(req, res, next);
    listeners.get('finish')?.();

    expect(next).toHaveBeenCalledTimes(1);
    expect(getMetrics().requests).toMatchObject({ total: 1, clientErrors: 1 });
    expect(getMetrics().requests.byRoute).toEqual([
      { method: 'POST', path: '/auth/login', status: 401, count: 1 },
    ]);
  });

  it.each(['/health', '/auth/health', '/metrics', '/favicon.ico', '/static/app.js'])(
    'no registra la ruta excluida %s',
    (path) => {
      const req = { method: 'GET', path } as unknown as Request;
      const res = { on: jest.fn() } as unknown as Response;
      const next = jest.fn() as NextFunction;

      metricsMiddleware(req, res, next);

      expect(res.on).not.toHaveBeenCalled();
      expect(getMetrics().requests.total).toBe(0);
    },
  );
});
