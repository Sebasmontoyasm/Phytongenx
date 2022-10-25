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

routes.use('/api/masterdata', masterdata);
routes.use('/api/cms',cms);
routes.use('/api/qb',qb);
routes.use('/api/auth', auth);
routes.use('/api/users', user);
routes.use('/api/userlogs', userlog);
routes.use('/api/restore',restore);
routes.use('/api/rpa',rpa);

export default routes;