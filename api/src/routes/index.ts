import { Router } from 'express';
import auth from './auth';
import users from './users';
import jobs from './jobs';
import candidates from './candidates';

const router = Router();
router.use('/auth', auth);
router.use('/users', users);
router.use('/jobs', jobs);
router.use('/candidates', candidates);

export default router;
