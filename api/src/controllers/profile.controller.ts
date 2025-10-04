import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { User, sequelize } from '../models';
import { AuthRequest } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export const uploadResume = upload.single('resume');
export const uploadAvatar = upload.single('avatar');

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    console.log(`🔍 Profile get request for user: ${userId}`);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log(`👤 Retrieved user data:`, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      skills: user.skills,
      updatedAt: user.updatedAt
    });

    const { password, ...profile } = user.toJSON();
    res.json(profile);
  } catch (e) { 
    console.error('Get profile error:', e);
    next(e); 
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    console.log(`🔍 Profile update request for user: ${userId}`);
    console.log(`📝 Update data:`, req.body);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log(`👤 Current user data:`, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      skills: user.skills
    });

    const { password, ...updateData } = req.body;
    
    // Use transaction to ensure data persistence
    const transaction = await sequelize.transaction();
    
    try {
      console.log(`💾 Updating user with data:`, updateData);
      await user.update(updateData, { transaction });
      await transaction.commit();
      
      console.log(`✅ Transaction committed successfully`);
      
      // Reload user to get updated data
      await user.reload();
      
      console.log(`🔄 User data after reload:`, {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        skills: user.skills
      });
      
      const { password: _, ...profile } = user.toJSON();
      res.json(profile);
    } catch (updateError) {
      console.error(`❌ Update transaction failed:`, updateError);
      await transaction.rollback();
      throw updateError;
    }
  } catch (e) { 
    console.error('Profile update error:', e);
    next(e); 
  }
}

export async function uploadResumeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resumeUrl = `/uploads/${req.file.filename}`;
    
    // Use transaction to ensure data persistence
    const transaction = await sequelize.transaction();
    
    try {
      await user.update({ resumeUrl }, { transaction });
      await transaction.commit();
      
      res.json({ message: 'Resume uploaded successfully', resumeUrl });
    } catch (updateError) {
      await transaction.rollback();
      throw updateError;
    }
  } catch (e) { 
    console.error('Resume upload error:', e);
    next(e); 
  }
}

export async function uploadAvatarHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Use transaction to ensure data persistence
    const transaction = await sequelize.transaction();
    
    try {
      await user.update({ avatarUrl }, { transaction });
      await transaction.commit();
      
      res.json({ message: 'Avatar uploaded successfully', avatarUrl });
    } catch (updateError) {
      await transaction.rollback();
      throw updateError;
    }
  } catch (e) { 
    console.error('Avatar upload error:', e);
    next(e); 
  }
}

export async function getSkills(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ skills: user.skills || [] });
  } catch (e) { next(e); }
}

export async function updateSkills(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use transaction to ensure data persistence
    const transaction = await sequelize.transaction();
    
    try {
      await user.update({ skills }, { transaction });
      await transaction.commit();
      
      res.json({ skills });
    } catch (updateError) {
      await transaction.rollback();
      throw updateError;
    }
  } catch (e) { 
    console.error('Skills update error:', e);
    next(e); 
  }
}
