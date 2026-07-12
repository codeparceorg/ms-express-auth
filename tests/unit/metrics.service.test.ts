import { getMetrics, recordRequest, resetMetrics } from '../../src/services/metrics.service';

describe('metrics.service', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('acumula solicitudes, duraciones y errores por ruta', () => {
    recordRequest({ method: 'POST', path: '/auth/login', status: 200, durationMs: 12 });
    recordRequest({ method: 'POST', path: '/auth/login', status: 200, durationMs: 8 });
    recordRequest({ method: 'POST', path: '/auth/login', status: 401, durationMs: 4 });
    recordRequest({ method: 'GET', path: '/error', status: 500, durationMs: 20 });

    const metrics = getMetrics();

    expect(metrics.requests).toMatchObject({
      total: 4,
      clientErrors: 1,
      serverErrors: 1,
      durationMs: { total: 44, max: 20 },
    });
    expect(metrics.requests.byRoute).toEqual(expect.arrayContaining([
      { method: 'POST', path: '/auth/login', status: 200, count: 2 },
      { method: 'POST', path: '/auth/login', status: 401, count: 1 },
      { method: 'GET', path: '/error', status: 500, count: 1 },
    ]));
  });

  it('expone datos del proceso sin información de solicitudes', () => {
    const metrics = getMetrics();

    expect(metrics.requests.total).toBe(0);
    expect(metrics.process.uptimeSeconds).toBeGreaterThan(0);
    expect(metrics.process.memory.rssBytes).toBeGreaterThan(0);
    expect(metrics.process.memory.heapUsedBytes).toBeGreaterThan(0);
  });
});
