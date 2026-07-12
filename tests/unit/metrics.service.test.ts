import {
  getMetrics,
  recordHttpRequest,
  resetHttpMetrics,
} from '../../src/services/metrics.service';

describe('metrics.service', () => {
  beforeEach(() => {
    resetHttpMetrics();
  });

  it('registra contador e histograma con las etiquetas Prometheus', async () => {
    const labels = { method: 'POST', route: '/auth/login', status_code: '200' };
    recordHttpRequest(labels, 0.03);

    const metrics = await getMetrics();

    expect(metrics).toContain('http_requests_total{method="POST",route="/auth/login",status_code="200"} 1');
    expect(metrics).toContain('http_request_duration_seconds_count{method="POST",route="/auth/login",status_code="200"} 1');
  });

  it('incluye las métricas predeterminadas del proceso', async () => {
    const metrics = await getMetrics();

    expect(metrics).toContain('# HELP process_resident_memory_bytes');
  });
});
