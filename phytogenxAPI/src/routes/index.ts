import {Router} from 'express';
import auth from './auth';
import user from './user';
import masterdata from './masterdata';
import cms from './cms';
import qb from './qb';
import userlog from './userlog';
import restore from './restore';
import rpa from './rpa';

const routes = Router();

routes.use('/masterdata', masterdata);
routes.use('/cms',cms);
routes.use('/qb',qb);
routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/userlogs', userlog);
routes.use('/restore',restore);
routes.use('/rpa',rpa);

export default routes;