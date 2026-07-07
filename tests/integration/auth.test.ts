import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/signup', () => {
  it('debe devolver 400 si el email es inválido', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'invalid-email', password: 'Password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });

  it('debe devolver 400 si la contraseña no cumple requisitos', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });

  it('debe devolver 400 si la contraseña no tiene mayúscula', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });

  it('debe devolver 400 si la contraseña no tiene dígito', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'Passworddd' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });
});

describe('POST /auth/login', () => {
  it('debe devolver 400 si el email es inválido', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'invalid-email', password: 'Password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });

  it('debe devolver 400 si la contraseña es muy corta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });
});

describe('POST /auth/refresh', () => {
  it('debe devolver 400 si falta refreshToken', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });

  it('debe devolver 400 si refreshToken es vacío', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: '' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación.');
  });
});
