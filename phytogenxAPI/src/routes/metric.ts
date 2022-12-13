import { MetricController } from "../controller/MetricController";
import { checkJwt } from '../middlewares/jwt';
import { Router } from 'express';

const router = Router();

router.get('/po_found',[checkJwt],MetricController.getCmsFound);
router.get('/po_loaded',[checkJwt],MetricController.getCmsLoader);
router.get('/invoice_found',[checkJwt],MetricController.getQbFound);
router.get('/invoice_loader',[checkJwt],MetricController.getQbLoader);

export default router;