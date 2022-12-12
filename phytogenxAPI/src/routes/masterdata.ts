import { MDController  } from "../controller/MDController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';

const router = Router();

router.get("",[checkJwt],MDController.getAll);
router.get("/last",[checkJwt,checkRole(['cms','cmsandqb','administrator'])],MDController.getLastId);
router.get("/:id",[checkJwt],MDController.getById);
router.post("",[checkJwt], MDController.new);
router.delete("/:id",[checkJwt,checkRole(['administrator'])], MDController.delete);

export default router;