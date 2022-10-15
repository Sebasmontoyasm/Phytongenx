import {Router} from 'express';
import auth from './auth';
import user from './user';
import masterdata from './masterdata';

const routes = Router();

routes.use('/masterdata', masterdata);
routes.use('/auth', auth);
routes.use('/users', user);


export default routes;