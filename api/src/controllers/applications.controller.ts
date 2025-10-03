import { Request, Response, NextFunction } from 'express';
import { Application, Job, User } from '../models';
import { AuthRequest } from '../middleware/auth';

export async function getUserApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const applications = await Application.findAll({
      where: { userId },
      include: [{ model: Job, as: 'job' }],
    });
    res.json(applications);
  } catch (e) { next(e); }
}

export async function applyToJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { jobId, coverLetter, resumeUrl } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const existingApplication = await Application.findOne({
      where: { userId, jobId }
    });
    if (existingApplication) {
      return res.status(409).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      userId,
      jobId,
      status: 'pending',
      coverLetter,
      resumeUrl,
    });

    res.status(201).json(application);
  } catch (e) { next(e); }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const application = await Application.findOne({
      where: { id: req.params.id, userId },
      include: [{ model: Job, as: 'job' }],
    });
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json(application);
  } catch (e) { next(e); }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const application = await Application.findOne({
      where: { id: req.params.id, userId }
    });
    if (!application) return res.status(404).json({ message: 'Not found' });

    await application.update(req.body);
    res.json(application);
  } catch (e) { next(e); }
}

export async function withdrawApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const deleted = await Application.destroy({
      where: { id: req.params.id, userId }
    });
    res.json({ deleted: deleted > 0 });
  } catch (e) { next(e); }
}

export async function getJobApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = (req as AuthRequest).user?.role;
    if (userRole !== 'employer') return res.status(403).json({ message: 'Forbidden' });

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{ model: User, as: 'user' }],
    });
    res.json(applications);
  } catch (e) { next(e); }
}
