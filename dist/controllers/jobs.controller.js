"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobs = listJobs;
exports.getJob = getJob;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
const models_1 = require("../models");
async function listJobs(_req, res, next) {
    try {
        const jobs = await models_1.Job.findAll();
        res.json(jobs);
    }
    catch (e) {
        next(e);
    }
}
async function getJob(req, res, next) {
    try {
        const job = await models_1.Job.findByPk(req.params.id);
        if (!job)
            return res.status(404).json({ message: 'Not found' });
        res.json(job);
    }
    catch (e) {
        next(e);
    }
}
async function createJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const jobData = {
            ...req.body,
            // You might want to add companyId or other user-specific data here
        };
        const created = await models_1.Job.create(jobData);
        res.status(201).json(created);
    }
    catch (e) {
        console.error('Error creating job:', e);
        next(e);
    }
}
async function updateJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const job = await models_1.Job.findByPk(req.params.id);
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        await job.update(req.body);
        res.json(job);
    }
    catch (e) {
        console.error('Error updating job:', e);
        next(e);
    }
}
async function deleteJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Find the job first to check if it exists
        const job = await models_1.Job.findByPk(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // For now, allow any authenticated employer to delete any job
        // In a real app, you might want to check if the job belongs to the user's company
        const deleted = await models_1.Job.destroy({ where: { id: req.params.id } });
        res.json({
            success: true,
            deleted: deleted,
            message: 'Job deleted successfully'
        });
    }
    catch (e) {
        console.error('Error deleting job:', e);
        next(e);
    }
}
//# sourceMappingURL=jobs.controller.js.map