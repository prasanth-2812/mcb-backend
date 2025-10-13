import { Request, Response, NextFunction } from 'express';
import { Candidate } from '../models';
import { Op } from 'sequelize';

export async function listCandidates(req: Request, res: Response, next: NextFunction) {
  try {
    const { 
      search, 
      location, 
      experience, 
      skills,
      minRating,
      page = 1, 
      limit = 20 
    } = req.query;

    const where: any = {};

    // Search by name, job title, or skills
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { jobTitle: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by location
    if (location && location !== 'all') {
      where.location = { [Op.like]: `%${location}%` };
    }

    // Filter by experience
    if (experience && experience !== 'all') {
      where.experience = { [Op.like]: `%${experience}%` };
    }

    // Filter by minimum rating
    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating as string) };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: candidates, count: total } = await Candidate.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['rating', 'DESC'], ['lastActive', 'DESC']],
    });

    // Filter by skills in memory if needed (since JSON field filtering is complex)
    let filteredCandidates = candidates;
    if (skills && skills !== 'all') {
      filteredCandidates = candidates.filter(candidate => 
        candidate.skills && 
        candidate.skills.some((skill: string) => 
          skill.toLowerCase().includes((skills as string).toLowerCase())
        )
      );
    }

    res.json({
      candidates: filteredCandidates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
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
