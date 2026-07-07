import { Router, IRouter } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';

const router: IRouter = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export default router;
