import request from 'supertest';
import app from '../../src/app';
import { resetMetrics } from '../../src/services/metrics.service';

describe('GET /metrics', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('devuelve métricas de proceso en formato JSON sin autenticación', async () => {
    const response = await request(app).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toMatchObject({
      requests: {
        total: 0,
        clientErrors: 0,
        serverErrors: 0,
        durationMs: { total: 0, max: 0 },
        byRoute: [],
      },
      process: {
        uptimeSeconds: expect.any(Number),
        memory: {
          rssBytes: expect.any(Number),
          heapUsedBytes: expect.any(Number),
        },
      },
    });
  });

  it('contabiliza solicitudes instrumentadas pero no health ni métricas', async () => {
    await request(app).post('/auth/login').send({ email: 'invalid-email', password: 'Password123' });
    await request(app).get('/auth/health');
    const response = await request(app).get('/metrics');

    expect(response.body.requests.total).toBe(1);
    expect(response.body.requests.clientErrors).toBe(1);
    expect(response.body.requests.byRoute).toEqual([
      { method: 'POST', path: '/auth/login', status: 400, count: 1 },
    ]);
  });
});
