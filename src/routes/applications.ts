import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getUserApplications,
  applyToJob,
  getApplication,
  updateApplication,
  withdrawApplication,
  getJobApplications,
  getAllEmployerApplications,
  getEmployerStats
} from '../controllers/applications.controller';

const router = Router();
router.use(authenticate);

// Employer-specific routes (must come before parameter routes)
router.get('/employer/all', authorize('employer'), getAllEmployerApplications);
router.get('/employer/stats', authorize('employer'), getEmployerStats);
router.get('/job/:jobId', authorize('employer'), getJobApplications);

// Employee routes
router.get('/', getUserApplications);
router.post('/', applyToJob);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', withdrawApplication);

export default router;
