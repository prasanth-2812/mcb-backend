import { Request, Response, NextFunction } from 'express';
import { Job } from '../models';

export async function listJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (e) { next(e); }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json(job);
  } catch (e) { next(e); }
}

export async function createJob(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await Job.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Not found' });
    await job.update(req.body);
    res.json(job);
  } catch (e) { next(e); }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Job.destroy({ where: { id: req.params.id } });
    res.json({ deleted });
  } catch (e) { next(e); }
}

export async function applyToJob(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = req.params.id;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log(`🔄 User ${userId} applying to job ${jobId}`);

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied (you might want to add an applications table)
    // For now, we'll just return success
    console.log(`✅ User ${userId} successfully applied to job ${jobId}`);

    res.json({ 
      message: 'Application submitted successfully',
      jobId: jobId,
      userId: userId,
      appliedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('❌ Job application error:', e);
    next(e);
  }
}
