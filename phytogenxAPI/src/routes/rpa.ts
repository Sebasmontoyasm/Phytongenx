import { checkJwt } from '../middlewares/jwt';
import { Router } from 'express';
import { RPAController } from '../controller/RPAController';

const router = Router();
router.get("/status",[checkJwt],RPAController.status);

export default router;
