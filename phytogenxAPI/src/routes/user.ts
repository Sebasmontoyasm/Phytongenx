import { UserController  } from "../controller/UserController";
import { checkJwt } from '../middlewares/jwt';
import { checkRole } from '../middlewares/rol';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/',[checkJwt,checkRole(['administrator'])], UserController.getAll);

// Get one user
router.get('/:id',[checkJwt,checkRole(['administrator'])], UserController.getById);

// Create a new user
router.post('/',UserController.new);

// Edit user
router.patch('/:id',[checkJwt,checkRole(['administrator'])], UserController.update);

// Delete
router.delete('/:id',[checkJwt,checkRole(['administrator'])], UserController.delete);

export default router;