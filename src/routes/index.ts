import { Router, IRouter } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import metricsRoutes from './metrics.routes';

const router: IRouter = Router();

router.use('/auth/health', healthRoutes);
router.use('/auth/metrics', metricsRoutes);
router.use('/auth', authRoutes);

export default router;
