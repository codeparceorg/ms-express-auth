import { getHealth } from '../../src/services/health.service';

describe('health.service', () => {
  describe('getHealth', () => {
    it('debe devolver status UP', () => {
      const result = getHealth();

      expect(result.status).toBe('UP');
    });

    it('debe devolver el nombre del servicio', () => {
      const result = getHealth();

      expect(result.service).toBe('auth-service');
    });

    it('debe devolver la version', () => {
      const result = getHealth();

      expect(result.version).toBe('1.0.0');
    });

    it('debe devolver un timestamp valido', () => {
      const result = getHealth();

      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('debe devolver uptime como numero positivo', () => {
      const result = getHealth();

      expect(result.uptime).toBeGreaterThan(0);
    });
  });
});
