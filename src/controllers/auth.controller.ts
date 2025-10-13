import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone, role, companyName, skills } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Prepare user data based on role
    const userData: any = {
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: role || 'employee',
    };

    // Add role-specific fields
    if (role === 'employer' && companyName) {
      userData.companyName = companyName;
    } else if (role === 'employee' && skills) {
      userData.skills = skills;
    }

    const user = await User.create(userData);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Safely extract user data without password
    console.log('User object from database:', user);
    console.log('User dataValues:', user.dataValues);
    
    const responseUserData = {
      id: user.id || user.dataValues?.id,
      email: user.email || user.dataValues?.email,
      name: user.name || user.dataValues?.name,
      phone: user.phone || user.dataValues?.phone,
      role: user.role || user.dataValues?.role,
      companyName: user.companyName || user.dataValues?.companyName,
      skills: user.skills || user.dataValues?.skills,
      resumeUrl: user.resumeUrl || user.dataValues?.resumeUrl,
      avatarUrl: user.avatarUrl || user.dataValues?.avatarUrl,
      createdAt: user.createdAt || user.dataValues?.createdAt,
      updatedAt: user.updatedAt || user.dataValues?.updatedAt
    };

    console.log('Final responseUserData:', responseUserData);

    res.status(201).json({
      token,
      user: responseUserData,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.id, user.email);
    console.log('User dataValues:', user.dataValues);

    // Get password from dataValues
    const userPassword = user.password || user.dataValues?.password;
    console.log('User password available:', !!userPassword);

    // Verify password
    const valid = await bcrypt.compare(password, userPassword);
    if (!valid) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password valid, generating token...');

    // Generate JWT token
    const tokenPayload = { 
      id: user.id || user.dataValues?.id, 
      email: user.email || user.dataValues?.email, 
      role: user.role || user.dataValues?.role 
    };
    
    const token = jwt.sign(
      tokenPayload, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
    console.log('Token generated successfully');

    // Extract user data safely from dataValues
    const userData = {
      id: user.id || user.dataValues?.id,
      email: user.email || user.dataValues?.email,
      name: user.name || user.dataValues?.name,
      phone: user.phone || user.dataValues?.phone,
      role: user.role || user.dataValues?.role,
      companyName: user.companyName || user.dataValues?.companyName,
      skills: user.skills || user.dataValues?.skills,
      resumeUrl: user.resumeUrl || user.dataValues?.resumeUrl,
      avatarUrl: user.avatarUrl || user.dataValues?.avatarUrl,
      createdAt: user.createdAt || user.dataValues?.createdAt,
      updatedAt: user.updatedAt || user.dataValues?.updatedAt
    };

    console.log('Sending response with user data:', userData);

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
      skills: user.skills,
      resumeUrl: user.resumeUrl,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
