import { MDController  } from "../controller/MDController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';

const router = Router();

router.patch('/cms/:id',[checkJwt,checkRole(['cms'])], MDController.updatecms);
router.post('/cms',[checkJwt,checkRole(['cms'])], MDController.newcms);

router.patch('/qb/:id',[checkJwt,checkRole(['qb'])], MDController.updatecms);

export default router;