import { CMSController  } from "../controller/CMSController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';

const router = Router();

router.get('',[checkJwt,checkRole(['cms','administrator'])], CMSController.getAll);
router.get('/performance',[checkJwt,checkRole(['cms','administrator'])], CMSController.performance);
router.get('/:ponumber',[checkJwt,checkRole(['cms','administrator'])], CMSController.getById);
router.patch('/:id',[checkJwt,checkRole(['cms','administrator'])], CMSController.update);

export default router;