"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchJobs = searchJobs;
exports.getFilterOptions = getFilterOptions;
exports.getRecommendedJobs = getRecommendedJobs;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
async function searchJobs(req, res, next) {
    try {
        const { q, location, type, category, minSalary, maxSalary, isRemote } = req.query;
        const where = {};
        if (q) {
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${q}%` } },
                { description: { [sequelize_1.Op.like]: `%${q}%` } },
                { company: { [sequelize_1.Op.like]: `%${q}%` } }
            ];
        }
        if (location) {
            where.location = { [sequelize_1.Op.like]: `%${location}%` };
        }
        if (type) {
            where.type = type;
        }
        if (category) {
            where.category = category;
        }
        if (isRemote !== undefined) {
            where.isRemote = isRemote === 'true';
        }
        const jobs = await models_1.Job.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });
        res.json(jobs);
    }
    catch (e) {
        next(e);
    }
}
async function getFilterOptions(req, res, next) {
    try {
        const [locations, types, categories] = await Promise.all([
            models_1.Job.findAll({
                attributes: ['location'],
                where: { location: { [sequelize_1.Op.ne]: null } },
                group: ['location'],
                raw: true,
            }),
            models_1.Job.findAll({
                attributes: ['type'],
                where: { type: { [sequelize_1.Op.ne]: null } },
                group: ['type'],
                raw: true,
            }),
            models_1.Job.findAll({
                attributes: ['category'],
                where: { category: { [sequelize_1.Op.ne]: null } },
                group: ['category'],
                raw: true,
            }),
        ]);
        res.json({
            locations: locations.map(l => l.location).filter(Boolean),
            types: types.map(t => t.type).filter(Boolean),
            categories: categories.map(c => c.category).filter(Boolean),
        });
    }
    catch (e) {
        next(e);
    }
}
async function getRecommendedJobs(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        // Simple recommendation based on user's skills and preferences
        const user = await models_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const userSkills = user.skills || [];
        const where = {};
        if (userSkills.length > 0) {
            where[sequelize_1.Op.or] = userSkills.map(skill => ({
                description: { [sequelize_1.Op.like]: `%${skill}%` }
            }));
        }
        const jobs = await models_1.Job.findAll({
            where,
            limit: 10,
            order: [['createdAt', 'DESC']],
        });
        res.json(jobs);
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=search.controller.js.map