import crypto from 'crypto';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import * as authTokenRepository from '../repositories/auth-token.repository';
import { AuthResponse, RefreshResponse } from '../dto/auth.dto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getRefreshExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
}


function buildAuthResponse(id: string, email: string): AuthResponse {
  const payload = { sub: id, email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return {
    accessToken,
    refreshToken,
    id: id,
  };
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const existing = await authTokenRepository.findByEmail(email);
  if (existing) {
    throw new AppError(400, 'El correo ya se encuentra registrado.');
  }

  const passwordHash = await hashPassword(password);
  const payload = { sub: '', email };
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshExpiry();

  const created = await authTokenRepository.create(email, passwordHash, tokenHash, expiresAt);

  const authPayload = { sub: created.id, email };
  const accessToken = generateAccessToken(authPayload);

  return {
    accessToken,
    refreshToken,
    id: created.id
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const record = await authTokenRepository.findByEmail(email);
  if (!record) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const passwordValid = await comparePassword(password, record.password);
  if (!passwordValid) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const existingTokens = await authTokenRepository.findByEmail(email);
  if (existingTokens) {
    await authTokenRepository.revokeByEmail(email);
  }

  const payload = { sub: record.id, email };
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshExpiry();

  await authTokenRepository.updateToken(email, tokenHash, expiresAt);

  return buildAuthResponse(record.id, email);
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  let payload;
  try {
    payload = verifyToken(refreshToken);
  } catch {
    throw new AppError(401, 'Token inválido o expirado');
  }

  const tokenHash = hashToken(refreshToken);
  const record = await authTokenRepository.findByTokenHash(tokenHash);
  if (!record) {
    throw new AppError(401, 'Token inválido o expirado');
  }

  if (record.revoked) {
    throw new AppError(401, 'Token inválido o expirado');
  }

  if (new Date() > new Date(record.expires_at)) {
    throw new AppError(401, 'Token inválido o expirado');
  }

  await authTokenRepository.revokeByEmail(record.email);

  const newPayload = { sub: record.id, email: record.email };
  const newRefreshToken = generateRefreshToken(newPayload);
  const newTokenHash = hashToken(newRefreshToken);
  const expiresAt = getRefreshExpiry();

  await authTokenRepository.create(
    record.email,
    record.password,
    newTokenHash,
    expiresAt,
  );

  const newAccessToken = generateAccessToken(newPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
