import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob, applyToJob } from '../controllers/jobs.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/:id/apply', authenticate, applyToJob);
export default router;
