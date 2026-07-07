import { Router, IRouter } from 'express';
import { check } from '../controllers/health.controller';

const router: IRouter = Router();

router.get('/', check);

export default router;
