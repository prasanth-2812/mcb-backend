import { Router } from 'express';
import { listCandidates, getCandidate, createCandidate, updateCandidate, deleteCandidate } from '../controllers/candidates.controller';

const router = Router();
router.get('/', listCandidates);
router.get('/:id', getCandidate);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);
export default router;
