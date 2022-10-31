import { CMSController  } from "../controller/CMSController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { uploadFile } from "../middlewares/uploadfile";

const router = Router();

router.get('',[checkJwt,checkRole(['cms','administrator'])], CMSController.getAll);
router.get('/performance',[checkJwt,checkRole(['cms','administrator'])], CMSController.performance);
router.get('/:ponumber',[checkJwt,checkRole(['cms','administrator'])], CMSController.getById);
router.get('/pdf/:pdfname',[checkJwt,checkRole(['cms','administrator'])], CMSController.getPDF_Name);
router.patch('/:id',[checkJwt,checkRole(['cms','administrator'])], CMSController.update);
router.post('/upload',[checkJwt,checkRole(['cms','administrator']),uploadFile('cms')], CMSController.upload);

export default router;