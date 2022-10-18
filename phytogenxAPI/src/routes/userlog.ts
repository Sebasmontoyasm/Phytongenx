import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { UserlogsController } from "../controller/UserlogsController";

const router = Router();

router.get('',[checkJwt,checkRole(['administrator'])],UserlogsController.getAll);
router.get('/:id',[checkJwt,checkRole(['administrator'])],UserlogsController.getById);
router.post('',[checkJwt],UserlogsController.new);

export default router;