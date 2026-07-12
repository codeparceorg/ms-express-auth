import request from 'supertest';
import app from '../../src/app';
import { resetHttpMetrics } from '../../src/services/metrics.service';

describe('GET /auth/metrics', () => {
  beforeEach(() => {
    resetHttpMetrics();
  });

  it('devuelve las métricas Prometheus sin autenticación', async () => {
    const response = await request(app).get('/auth/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toContain('# HELP process_resident_memory_bytes');
    expect(response.text).toContain('# HELP http_requests_total Total HTTP requests');
  });

  it('instrumenta solicitudes HTTP pero no se contabiliza a sí mismo', async () => {
    await request(app).post('/auth/login').send({ email: 'invalid-email', password: 'Password123' });
    const response = await request(app).get('/auth/metrics');

    expect(response.text).toContain(
      'http_requests_total{method="POST",route="/login",status_code="400"} 1',
    );
    expect(response.text).toContain(
      'http_request_duration_seconds_count{method="POST",route="/login",status_code="400"} 1',
    );
    expect(response.text).not.toContain('route="/auth/metrics"');
  });
});
