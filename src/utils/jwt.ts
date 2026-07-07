import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: ACCESS_EXPIRES_IN as unknown as number });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: REFRESH_EXPIRES_IN as unknown as number });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
