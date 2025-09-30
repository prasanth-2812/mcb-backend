import { Request, Response, NextFunction } from 'express';
import { Candidate } from '../models';

export async function listCandidates(_req: Request, res: Response, next: NextFunction) {
  try {
    const candidates = await Candidate.findAll();
    res.json(candidates);
  } catch (e) { next(e); }
}

export async function getCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Not found' });
    res.json(candidate);
  } catch (e) { next(e); }
}

export async function createCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await Candidate.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Not found' });
    await candidate.update(req.body);
    res.json(candidate);
  } catch (e) { next(e); }
}

export async function deleteCandidate(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Candidate.destroy({ where: { id: req.params.id } });
    res.json({ deleted });
  } catch (e) { next(e); }
}
