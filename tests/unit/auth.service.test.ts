import * as authService from '../../src/services/auth.service';
import * as authTokenRepository from '../../src/repositories/auth-token.repository';
import * as passwordUtils from '../../src/utils/password';
import * as jwtUtils from '../../src/utils/jwt';
import { AppError } from '../../src/utils/errors';

jest.mock('../../src/repositories/auth-token.repository');
jest.mock('../../src/utils/password');
jest.mock('../../src/utils/jwt');

const mockRepository = authTokenRepository as jest.Mocked<typeof authTokenRepository>;
const mockPassword = passwordUtils as jest.Mocked<typeof passwordUtils>;
const mockJwt = jwtUtils as jest.Mocked<typeof jwtUtils>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth.service', () => {
  describe('signup', () => {
    it('debe crear un usuario y devolver tokens', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockPassword.hashPassword.mockResolvedValue('hashed-password');
      mockJwt.generateRefreshToken.mockReturnValue('refresh-token');
      mockJwt.generateAccessToken.mockReturnValue('access-token');
      mockRepository.create.mockResolvedValue({
        id: 'uuid-123',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'token-hash',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        created_at: new Date(),
      });

      const result = await authService.signup('test@email.com', 'Password123');

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.id).toBe('uuid-123');
      expect(result.user.name).toBe('test');
    });

    it('debe lanzar error 400 si el email ya existe', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: 'existing-id',
        status: 'A',
        email: 'test@email.com',
        password: 'hash',
        token: 'token',
        expires_at: new Date(),
        revoked: false,
        created_at: new Date(),
      });

      await expect(
        authService.signup('test@email.com', 'Password123'),
      ).rejects.toThrow(new AppError(400, 'El correo ya se encuentra registrado.'));
    });
  });

  describe('login', () => {
    it('debe autenticar y devolver tokens', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: 'uuid-123',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'old-token-hash',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        created_at: new Date(),
      });
      mockPassword.comparePassword.mockResolvedValue(true);
      mockJwt.generateRefreshToken.mockReturnValue('new-refresh-token');
      mockJwt.generateAccessToken.mockReturnValue('new-access-token');
      mockRepository.updateToken.mockResolvedValue({
        id: 'uuid-123',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'new-token-hash',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        created_at: new Date(),
      });

      const result = await authService.login('test@email.com', 'Password123');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('debe lanzar error 401 si el email no existe', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('notfound@email.com', 'Password123'),
      ).rejects.toThrow(new AppError(401, 'Credenciales inválidas'));
    });

    it('debe lanzar error 401 si la contraseña es incorrecta', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: 'uuid-123',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'token',
        expires_at: new Date(),
        revoked: false,
        created_at: new Date(),
      });
      mockPassword.comparePassword.mockResolvedValue(false);

      await expect(
        authService.login('test@email.com', 'WrongPassword1'),
      ).rejects.toThrow(new AppError(401, 'Credenciales inválidas'));
    });
  });

  describe('refresh', () => {
    it('debe renovar tokens exitosamente', async () => {
      mockJwt.verifyToken.mockReturnValue({ sub: 'uuid-123', email: 'test@email.com' });
      mockRepository.findByTokenHash.mockResolvedValue({
        id: 'uuid-123',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'old-token-hash',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        created_at: new Date(),
      });
      mockJwt.generateRefreshToken.mockReturnValue('new-refresh-token');
      mockJwt.generateAccessToken.mockReturnValue('new-access-token');
      mockRepository.create.mockResolvedValue({
        id: 'uuid-456',
        status: 'A',
        email: 'test@email.com',
        password: 'hashed-password',
        token: 'new-token-hash',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        created_at: new Date(),
      });

      const result = await authService.refresh('valid-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('debe lanzar error 401 si el token es inválido', async () => {
      mockJwt.verifyToken.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      await expect(
        authService.refresh('invalid-token'),
      ).rejects.toThrow(new AppError(401, 'Token inválido o expirado'));
    });
  });
});
