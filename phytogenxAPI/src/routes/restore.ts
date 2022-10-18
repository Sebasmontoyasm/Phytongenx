import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';
import { RestoreController } from "../controller/RestoreController";

const router = Router();

router.get('',[checkJwt,checkRole(['administrator'])],RestoreController.getAll);
router.post('',[checkJwt],RestoreController.save);

export default router;