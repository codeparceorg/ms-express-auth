import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

export interface HttpMetricLabels {
  [label: string]: string;
  method: string;
  route: string;
  status_code: string;
}

export const metricsRegistry = new Registry();

collectDefaultMetrics({ register: metricsRegistry });

export const httpRequestsTotal = new Counter<string>({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry],
});

export const httpRequestDuration = new Histogram<string>({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [metricsRegistry],
});

export function recordHttpRequest(labels: HttpMetricLabels, durationSeconds: number): void {
  httpRequestsTotal.inc(labels);
  httpRequestDuration.observe(labels, durationSeconds);
}

export async function getMetrics(): Promise<string> {
  return metricsRegistry.metrics();
}

export function resetHttpMetrics(): void {
  httpRequestsTotal.reset();
  httpRequestDuration.reset();
}
