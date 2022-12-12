import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { QbController } from "../controller/QbController";
import { uploadFile } from '../middlewares/uploadfile';

const router = Router();

router.get('',[checkJwt,checkRole(['qb','cmsandqb','administrator'])],QbController.getAll);
router.get('/performance',[checkJwt,checkRole(['qb','cmsandqb','administrator'])],QbController.getPerformance);
router.get('/:invoice',[checkJwt,checkRole(['qb','cmsandqb','administrator'])],QbController.getByInvoice);
router.get('/pdf/:namepdf',[checkJwt,checkRole(['qb','cmsandqb','administrator'])],QbController.getNamePDF);
router.patch('/:id',[checkJwt,checkRole(['qb','cmsandqb','administrator'])],QbController.update);
router.post('/upload',[checkJwt,checkRole(['qb','cmsandqb','administrator']),uploadFile('qb')], QbController.upload);

export default router;