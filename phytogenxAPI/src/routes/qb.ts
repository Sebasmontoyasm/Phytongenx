import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { QbController } from "../controller/QbController";
import { uploadFile } from '../middlewares/uploadfile';

const router = Router();

router.get('',[checkJwt,checkRole(['qb','administrator'])],QbController.getAll);
router.get('/performance',[checkJwt,checkRole(['qb','administrator'])],QbController.getPerformance);
router.get('/:invoice',[checkJwt,checkRole(['qb','administrator'])],QbController.getByInvoice);
router.get('/pdf/:namepdf',[checkJwt,checkRole(['qb','administrator'])],QbController.getNamePDF);
router.patch('/:id',[checkJwt,checkRole(['qb','administrator'])],QbController.update);
router.post('/upload',[checkJwt,checkRole(['qb','administrator']),uploadFile('qb')], QbController.upload);

export default router;