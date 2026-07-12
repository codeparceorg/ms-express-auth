import { NextFunction, Request, Response } from 'express';
import { metricsMiddleware } from '../../src/middleware/metrics.middleware';
import * as metricsService from '../../src/services/metrics.service';

describe('metrics.middleware', () => {
  it('registra método, ruta, estado y duración al finalizar la respuesta', () => {
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
    const recordSpy = jest.spyOn(metricsService, 'recordHttpRequest');

    metricsMiddleware(req, res, next);
    listeners.get('finish')?.();

    expect(next).toHaveBeenCalledTimes(1);
    expect(recordSpy).toHaveBeenCalledWith(
      { method: 'POST', route: '/auth/login', status_code: '401' },
      expect.any(Number),
    );
    expect(recordSpy.mock.calls[0][1]).toBeGreaterThanOrEqual(0);
  });

  it('no registra el endpoint de métricas', () => {
    const req = { method: 'GET', path: '/auth/metrics' } as unknown as Request;
    const res = { on: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const recordSpy = jest.spyOn(metricsService, 'recordHttpRequest');

    metricsMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.on).not.toHaveBeenCalled();
    expect(recordSpy).not.toHaveBeenCalled();
  });
});
