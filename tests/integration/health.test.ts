import request from 'supertest';
import app from '../../src/app';

describe('GET /health', () => {
  it('debe devolver 200 y status UP', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('auth-service');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeGreaterThan(0);
  });

  it('debe incluir X-Request-Id en la respuesta', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('debe responder en menos de 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});

describe('Request ID', () => {
  it('debe generar un requestId en las respuestas', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'Password123' });

    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('debe reutilizar el X-Request-Id enviado por el cliente', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .set('X-Request-Id', 'my-custom-id')
      .send({ email: 'test@example.com', password: 'Password123' });

    expect(res.headers['x-request-id']).toBe('my-custom-id');
  });
});
