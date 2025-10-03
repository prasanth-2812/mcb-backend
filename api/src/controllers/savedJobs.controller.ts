import { Request, Response, NextFunction } from 'express';
import { SavedJob, Job } from '../models';
import { AuthRequest } from '../middleware/auth';

export async function getSavedJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const savedJobs = await SavedJob.findAll({
      where: { userId },
      include: [{ model: Job, as: 'job' }],
    });
    res.json(savedJobs);
  } catch (e) { next(e); }
}

export async function saveJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const existing = await SavedJob.findOne({
      where: { userId, jobId }
    });
    if (existing) {
      return res.status(409).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({ userId, jobId });
    res.status(201).json(savedJob);
  } catch (e) { next(e); }
}

export async function unsaveJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const deleted = await SavedJob.destroy({
      where: { userId, jobId: req.params.jobId }
    });
    res.json({ deleted: deleted > 0 });
  } catch (e) { next(e); }
}
