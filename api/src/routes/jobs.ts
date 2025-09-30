import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobs.controller';

const router = Router();
router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
export default router;
