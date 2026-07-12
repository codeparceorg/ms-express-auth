export interface RequestMetric {
  method: string;
  path: string;
  status: number;
  count: number;
}

export interface MetricsResponse {
  requests: {
    total: number;
    clientErrors: number;
    serverErrors: number;
    durationMs: {
      total: number;
      max: number;
    };
    byRoute: RequestMetric[];
  };
  process: {
    uptimeSeconds: number;
    memory: {
      rssBytes: number;
      heapUsedBytes: number;
    };
  };
}

interface RecordedRequest {
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

interface AggregatedRequestMetric extends RequestMetric {
  key: string;
}

let totalRequests = 0;
let clientErrors = 0;
let serverErrors = 0;
let totalDurationMs = 0;
let maxDurationMs = 0;
const routeMetrics = new Map<string, AggregatedRequestMetric>();

export function recordRequest(metric: RecordedRequest): void {
  totalRequests += 1;
  totalDurationMs += metric.durationMs;
  maxDurationMs = Math.max(maxDurationMs, metric.durationMs);

  if (metric.status >= 400 && metric.status < 500) {
    clientErrors += 1;
  }
  if (metric.status >= 500) {
    serverErrors += 1;
  }

  const key = `${metric.method}|${metric.path}|${metric.status}`;
  const existing = routeMetrics.get(key);
  if (existing) {
    existing.count += 1;
    return;
  }

  routeMetrics.set(key, {
    method: metric.method,
    path: metric.path,
    status: metric.status,
    count: 1,
    key,
  });
}

export function getMetrics(): MetricsResponse {
  const memory = process.memoryUsage();
  const byRoute = [...routeMetrics.values()]
    .map(({ key: _key, ...metric }) => metric)
    .sort((first, second) => {
      const firstKey = `${first.method}|${first.path}|${first.status}`;
      const secondKey = `${second.method}|${second.path}|${second.status}`;
      return firstKey.localeCompare(secondKey);
    });

  return {
    requests: {
      total: totalRequests,
      clientErrors,
      serverErrors,
      durationMs: { total: totalDurationMs, max: maxDurationMs },
      byRoute,
    },
    process: {
      uptimeSeconds: process.uptime(),
      memory: { rssBytes: memory.rss, heapUsedBytes: memory.heapUsed },
    },
  };
}

export function resetMetrics(): void {
  totalRequests = 0;
  clientErrors = 0;
  serverErrors = 0;
  totalDurationMs = 0;
  maxDurationMs = 0;
  routeMetrics.clear();
}
