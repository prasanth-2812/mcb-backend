"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.uploadResume = void 0;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.uploadResumeHandler = uploadResumeHandler;
exports.uploadAvatarHandler = uploadAvatarHandler;
exports.getSkills = getSkills;
exports.updateSkills = updateSkills;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
exports.uploadResume = upload.single('resume');
exports.uploadAvatar = upload.single('avatar');
async function getProfile(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const { password, ...profile } = user.toJSON();
        res.json(profile);
    }
    catch (e) {
        next(e);
    }
}
async function updateProfile(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const { password, ...updateData } = req.body;
        await user.update(updateData);
        const { password: _, ...profile } = user.toJSON();
        res.json(profile);
    }
    catch (e) {
        next(e);
    }
}
async function uploadResumeHandler(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const resumeUrl = `/uploads/${req.file.filename}`;
        await user.update({ resumeUrl });
        res.json({ message: 'Resume uploaded successfully', resumeUrl });
    }
    catch (e) {
        next(e);
    }
}
async function uploadAvatarHandler(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const avatarUrl = `/uploads/${req.file.filename}`;
        await user.update({ avatarUrl });
        res.json({ message: 'Avatar uploaded successfully', avatarUrl });
    }
    catch (e) {
        next(e);
    }
}
async function getSkills(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ skills: user.skills || [] });
    }
    catch (e) {
        next(e);
    }
}
async function updateSkills(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { skills } = req.body;
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills must be an array' });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        await user.update({ skills });
        res.json({ skills });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=profile.controller.js.map