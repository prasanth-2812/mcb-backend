import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserApplications,
  applyToJob,
  getApplication,
  updateApplication,
  withdrawApplication,
  getJobApplications
} from '../controllers/applications.controller';

const router = Router();
router.use(authenticate);

router.get('/', getUserApplications);
router.post('/', applyToJob);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', withdrawApplication);
router.get('/job/:jobId', getJobApplications);

export default router;
