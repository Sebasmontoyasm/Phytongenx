import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { QbController } from "../controller/QbController";

const router = Router();

router.get('',[checkJwt,checkRole(['qb','administrator'])],QbController.getAll);
router.get('/performance',[checkJwt,checkRole(['qb','administrator'])],QbController.getPerformance);
router.get('/:invoice',[checkJwt,checkRole(['qb','administrator'])],QbController.getByInvoice);
router.patch('/:id',[checkJwt,checkRole(['qb','administrator'])],QbController.update);

export default router;