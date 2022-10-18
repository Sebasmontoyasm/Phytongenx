import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { QbController } from "../controller/QbController";

const router = Router();

router.get('',[checkJwt,checkRole(['qb','administrator'])],QbController.getAll);
router.patch('',[checkJwt,checkRole(['qb','administrator'])],QbController.update);

export default router;