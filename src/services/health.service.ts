export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
}

const startTime = Date.now();

export function getHealth(): HealthResponse {
  return {
    status: 'UP',
    service: 'auth-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: (Date.now() - startTime) / 1000,
  };
}
