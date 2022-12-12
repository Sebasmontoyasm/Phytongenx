import { CMSController  } from "../controller/CMSController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { uploadFile } from "../middlewares/uploadfile";

const router = Router();

router.get('',[checkJwt,checkRole(['cms','cmsandqb','administrator'])], CMSController.getAll);
router.get('/performance',[checkJwt,checkRole(['cms',,'cmsandqb','administrator'])], CMSController.performance);
router.get('/:ponumber',[checkJwt,checkRole(['cms','cmsandqb','administrator'])], CMSController.getById);
router.get('/pdf/:pdfname',[checkJwt,checkRole(['cms','cmsandqb','administrator'])], CMSController.getPDF_Name);
router.patch('/:id',[checkJwt,checkRole(['cms','cmsandqb','administrator'])], CMSController.update);
router.post('/upload',[checkJwt,checkRole(['cms','cmsandqb','administrator']),uploadFile('cms')], CMSController.upload);

export default router;