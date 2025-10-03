import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models';
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../services/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone, role } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Math.random().toString(36).substr(2, 9);
    
    const user = await User.create({
      id: userId,
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: role || 'employee',
    });

    const token = (jwt.sign as any)(
      { 
        id: String(user.id), 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as string }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    
    if (!user.password) {
      console.error('User has no password stored');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = (jwt.sign as any)(
      { 
        id: String(user.id), 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as string }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' });
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
    });
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('🔄 Forgot password request for email:', email);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    console.log('✅ Reset token generated for user:', user.id);

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken, user.name);
    
    if (!emailSent) {
      console.error('❌ Failed to send password reset email to:', email);
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

    console.log('✅ Password reset email sent to:', email);

    res.json({ 
      message: 'If an account with that email exists, we have sent a password reset link.' 
    });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: e instanceof Error ? e.message : 'Unknown error' 
    });
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        message: 'Reset token and new password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('🔄 Password reset request with token:', token.substring(0, 10) + '...');

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date() // Token not expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    console.log('✅ Valid reset token found for user:', user.id);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    console.log('✅ Password updated for user:', user.id);

    // Send confirmation email
    const emailSent = await sendPasswordResetConfirmationEmail(user.email, user.name);
    
    if (!emailSent) {
      console.warn('⚠️ Failed to send confirmation email to:', user.email);
      // Don't fail the request if email fails
    } else {
      console.log('✅ Password reset confirmation email sent to:', user.email);
    }

    res.json({ 
      message: 'Password has been successfully reset. You can now log in with your new password.' 
    });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: e instanceof Error ? e.message : 'Unknown error' 
    });
  }
}
