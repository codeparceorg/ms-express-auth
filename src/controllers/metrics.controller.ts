import { Request, Response } from 'express';
import { getMetrics } from '../services/metrics.service';

export function getApplicationMetrics(_req: Request, res: Response): void {
  res.status(200).json(getMetrics());
}
