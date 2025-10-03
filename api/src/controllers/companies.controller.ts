import { Request, Response, NextFunction } from 'express';
import { Company, Job } from '../models';

export async function getCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const companies = await Company.findAll({
      order: [['name', 'ASC']],
    });
    res.json(companies);
  } catch (e) { next(e); }
}

export async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Not found' });
    res.json(company);
  } catch (e) { next(e); }
}

export async function getCompanyJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await Job.findAll({
      where: { companyId: req.params.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (e) { next(e); }
}
