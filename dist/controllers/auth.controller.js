"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
async function register(req, res, next) {
    try {
        const { email, password, name, phone, role, companyName, skills } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }
        const exists = await models_1.User.findOne({ where: { email } });
        if (exists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Prepare user data based on role
        const userData = {
            email,
            password: hashedPassword,
            name,
            phone: phone || null,
            role: role || 'employee',
        };
        // Add role-specific fields
        if (role === 'employer' && companyName) {
            userData.companyName = companyName;
        }
        else if (role === 'employee' && skills) {
            userData.skills = skills;
        }
        const user = await models_1.User.create(userData);
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        console.log('Login attempt for email:', email);
        // Find user by email
        const user = await models_1.User.findOne({ where: { email } });
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
        const valid = await bcryptjs_1.default.compare(password, userPassword);
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
        const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
async function me(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await models_1.User.findByPk(userId);
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
    }
    catch (error) {
        console.error('Me endpoint error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
//# sourceMappingURL=auth.controller.js.map