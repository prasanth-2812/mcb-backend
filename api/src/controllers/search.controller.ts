import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Job, Company, User } from '../models';
import { AuthRequest } from '../middleware/auth';

export async function searchJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, location, type, category, minSalary, maxSalary, isRemote } = req.query;
    
    const where: any = {};
    
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { company: { [Op.like]: `%${q}%` } }
      ];
    }
    
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }
    
    if (type) {
      where.type = type;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (isRemote !== undefined) {
      where.isRemote = isRemote === 'true';
    }

    const jobs = await Job.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(jobs);
  } catch (e) { next(e); }
}

export async function getFilterOptions(req: Request, res: Response, next: NextFunction) {
  try {
    const [locations, types, categories] = await Promise.all([
      Job.findAll({
        attributes: ['location'],
        where: { location: { [Op.ne]: null } },
        group: ['location'],
        raw: true,
      }),
      Job.findAll({
        attributes: ['type'],
        where: { type: { [Op.ne]: null } },
        group: ['type'],
        raw: true,
      }),
      Job.findAll({
        attributes: ['category'],
        where: { category: { [Op.ne]: null } },
        group: ['category'],
        raw: true,
      }),
    ]);

    res.json({
      locations: locations.map(l => l.location).filter(Boolean),
      types: types.map(t => t.type).filter(Boolean),
      categories: categories.map(c => c.category).filter(Boolean),
    });
  } catch (e) { next(e); }
}

export async function getRecommendedJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Simple recommendation based on user's skills and preferences
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userSkills = user.skills || [];
    const where: any = {};

    if (userSkills.length > 0) {
      where[Op.or] = userSkills.map(skill => ({
        description: { [Op.like]: `%${skill}%` }
      }));
    }

    const jobs = await Job.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    res.json(jobs);
  } catch (e) { next(e); }
}
