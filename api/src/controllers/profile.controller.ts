import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { User } from '../models';
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

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password, ...profile } = user.toJSON();
    res.json(profile);
  } catch (e) { next(e); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password, ...updateData } = req.body;
    await user.update(updateData);

    const { password: _, ...profile } = user.toJSON();
    res.json(profile);
  } catch (e) { next(e); }
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
    await user.update({ resumeUrl });

    res.json({ message: 'Resume uploaded successfully', resumeUrl });
  } catch (e) { next(e); }
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
    await user.update({ avatarUrl });

    res.json({ message: 'Avatar uploaded successfully', avatarUrl });
  } catch (e) { next(e); }
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

    await user.update({ skills });
    res.json({ skills });
  } catch (e) { next(e); }
}
