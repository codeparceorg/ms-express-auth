import { IRouter, Router } from 'express';
import { getApplicationMetrics } from '../controllers/metrics.controller';

const router: IRouter = Router();

router.get('/', getApplicationMetrics);

export default router;
