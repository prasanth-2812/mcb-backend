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
