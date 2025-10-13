import { Request, Response, NextFunction } from 'express';
import { Job } from '../models';
import { AuthRequest } from '../middleware/auth';

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
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the user to access their company name
    const { User } = await import('../models');
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.companyName) {
      return res.status(400).json({ message: 'Employer must have a company name' });
    }

    // Extract and validate required fields
    const { title, location, type, category, description, salary, experience, skills, requirements, responsibilities, benefits, isRemote } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Job title is required' });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ message: 'Job location is required' });
    }

    // Prepare job data for the database (only fields that exist in the model)
    const jobData = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
      title: title.trim(),
      company: user.companyName,
      companyId: userId,
      location: location.trim(),
      type: type || 'Full Time',
      category: category || 'General',
      isRemote: isRemote || false,
      description: description || `Job Type: ${type || 'Full Time'}\nLocation: ${location}\nSkills: ${skills ? skills.join(', ') : 'Not specified'}`
    };

    console.log('Creating job with data:', jobData);

    const created = await Job.create(jobData);
    
    // Return the created job with additional fields that were passed but not stored
    const responseData = {
      ...created.toJSON(),
      salary,
      experience,
      skills,
      requirements,
      responsibilities,
      benefits
    };

    res.status(201).json(responseData);
  } catch (e) { 
    console.error('Error creating job:', e);
    next(e); 
  }
}

export async function updateJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    await job.update(req.body);
    res.json(job);
  } catch (e) { 
    console.error('Error updating job:', e);
    next(e); 
  }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the job first to check if it exists
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // For now, allow any authenticated employer to delete any job
    // In a real app, you might want to check if the job belongs to the user's company
    const deleted = await Job.destroy({ where: { id: req.params.id } });
    
    res.json({ 
      success: true,
      deleted: deleted,
      message: 'Job deleted successfully'
    });
  } catch (e) { 
    console.error('Error deleting job:', e);
    next(e); 
  }
}

export async function getEmployerJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    const userRole = (req as AuthRequest).user?.role;
    
    if (!userId || userRole !== 'employer') {
      return res.status(403).json({ message: 'Forbidden - Employer access only' });
    }

    // Get the user to access their company name
    const { User, Application } = await import('../models');
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user doesn't have companyName, provide helpful error with user details
    if (!user.companyName) {
      console.log('User without companyName:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName
      });
      
      return res.status(400).json({ 
        message: 'Employer must have a company name',
        details: {
          userId: user.id,
          email: user.email,
          name: user.name,
          currentCompanyName: user.companyName,
          suggestion: 'Please update your profile with a company name'
        }
      });
    }

    // Find all jobs for this employer's company
    const jobs = await Job.findAll({
      where: { company: user.companyName },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status', 'userId', 'createdAt'],
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    // Transform jobs to include application counts
    const jobsWithStats = jobs.map(job => {
      const jobData = job.toJSON() as any;
      const applications = jobData.applications || [];
      
      return {
        ...jobData,
        applicationsCount: applications.length,
        applications: undefined, // Remove the full applications array
      };
    });

    console.log(`Found ${jobsWithStats.length} jobs for company: ${user.companyName}`);
    res.json(jobsWithStats);
  } catch (e) { 
    console.error('Error fetching employer jobs:', e);
    next(e); 
  }
}