import { Router } from 'express';
import auth from './auth';
import users from './users';
import jobs from './jobs';
import candidates from './candidates';
import applications from './applications';
import savedJobs from './savedJobs';
import notifications from './notifications';
import profile from './profile';
import search from './search';
import companies from './companies';
import analytics from './analytics';

const router = Router();
router.use('/auth', auth);
router.use('/users', users);
router.use('/jobs', jobs);
router.use('/candidates', candidates);
router.use('/applications', applications);
router.use('/saved-jobs', savedJobs);
router.use('/notifications', notifications);
router.use('/profile', profile);
router.use('/search', search);
router.use('/companies', companies);
router.use('/analytics', analytics);

export default router;
