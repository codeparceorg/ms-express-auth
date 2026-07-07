import { Router, IRouter } from 'express';
import { validate } from '../middleware/validate.middleware';
import { signupSchema, loginSchema, refreshSchema } from '../validators/auth.validator';
import * as authController from '../controllers/auth.controller';

const router: IRouter = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);

export default router;
