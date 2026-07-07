import { pool } from '../config/database';
import { AuthTokenEntity } from '../entities/auth-token.entity';

export async function findByEmail(email: string): Promise<AuthTokenEntity | null> {
  const result = await pool.query<AuthTokenEntity>(
    'SELECT * FROM auth_token WHERE email = $1 AND status = $2',
    [email, 'A'],
  );
  return result.rows[0] || null;
}

export async function findByTokenHash(tokenHash: string): Promise<AuthTokenEntity | null> {
  const result = await pool.query<AuthTokenEntity>(
    'SELECT * FROM auth_token WHERE token = $1 AND status = $2',
    [tokenHash, 'A'],
  );
  return result.rows[0] || null;
}

export async function create(
  email: string,
  passwordHash: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<AuthTokenEntity> {
  const result = await pool.query<AuthTokenEntity>(
    `INSERT INTO auth_token (email, password, token, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, passwordHash, tokenHash, expiresAt],
  );
  return result.rows[0];
}

export async function updateToken(
  email: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<AuthTokenEntity | null> {
  const result = await pool.query<AuthTokenEntity>(
    `UPDATE auth_token
     SET token = $1, expires_at = $2, revoked = false
     WHERE email = $3 AND status = $4
     RETURNING *`,
    [tokenHash, expiresAt, email, 'A'],
  );
  return result.rows[0] || null;
}

export async function revokeByEmail(email: string): Promise<void> {
  await pool.query(
    'UPDATE auth_token SET revoked = true WHERE email = $1 AND status = $2',
    [email, 'A'],
  );
}
