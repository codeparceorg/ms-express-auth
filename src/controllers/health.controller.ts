import { Request, Response } from 'express';
import { getHealth } from '../services/health.service';

export function check(_req: Request, res: Response): void {
  const health = getHealth();
  res.status(200).json(health);
}
