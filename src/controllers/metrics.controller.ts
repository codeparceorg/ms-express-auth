import { Request, Response } from 'express';
import { getMetrics, metricsRegistry } from '../services/metrics.service';

export async function getApplicationMetrics(_req: Request, res: Response): Promise<void> {
  const metrics = await getMetrics();
  res.setHeader('Content-Type', metricsRegistry.contentType);
  res.status(200).send(metrics);
}
