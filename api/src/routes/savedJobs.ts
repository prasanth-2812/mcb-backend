import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSavedJobs, saveJob, unsaveJob } from '../controllers/savedJobs.controller';

const router = Router();
router.use(authenticate);

router.get('/', getSavedJobs);
router.post('/', saveJob);
router.delete('/:jobId', unsaveJob);

export default router;
