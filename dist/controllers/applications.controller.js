"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserApplications = getUserApplications;
exports.applyToJob = applyToJob;
exports.getApplication = getApplication;
exports.updateApplication = updateApplication;
exports.withdrawApplication = withdrawApplication;
exports.getJobApplications = getJobApplications;
const models_1 = require("../models");
async function getUserApplications(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const applications = await models_1.Application.findAll({
            where: { userId },
            include: [{ model: models_1.Job, as: 'job' }],
        });
        res.json(applications);
    }
    catch (e) {
        next(e);
    }
}
async function applyToJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { jobId, coverLetter, resumeUrl } = req.body;
        if (!jobId)
            return res.status(400).json({ message: 'Job ID is required' });
        const existingApplication = await models_1.Application.findOne({
            where: { userId, jobId }
        });
        if (existingApplication) {
            return res.status(409).json({ message: 'Already applied to this job' });
        }
        const application = await models_1.Application.create({
            userId,
            jobId,
            status: 'pending',
            coverLetter,
            resumeUrl,
        });
        res.status(201).json(application);
    }
    catch (e) {
        next(e);
    }
}
async function getApplication(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const application = await models_1.Application.findOne({
            where: { id: req.params.id, userId },
            include: [{ model: models_1.Job, as: 'job' }],
        });
        if (!application)
            return res.status(404).json({ message: 'Not found' });
        res.json(application);
    }
    catch (e) {
        next(e);
    }
}
async function updateApplication(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const application = await models_1.Application.findOne({
            where: { id: req.params.id, userId }
        });
        if (!application)
            return res.status(404).json({ message: 'Not found' });
        await application.update(req.body);
        res.json(application);
    }
    catch (e) {
        next(e);
    }
}
async function withdrawApplication(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const deleted = await models_1.Application.destroy({
            where: { id: req.params.id, userId }
        });
        res.json({ deleted: deleted > 0 });
    }
    catch (e) {
        next(e);
    }
}
async function getJobApplications(req, res, next) {
    try {
        const userRole = req.user?.role;
        if (userRole !== 'employer')
            return res.status(403).json({ message: 'Forbidden' });
        const applications = await models_1.Application.findAll({
            where: { jobId: req.params.jobId },
            include: [{ model: models_1.User, as: 'user' }],
        });
        res.json(applications);
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=applications.controller.js.map