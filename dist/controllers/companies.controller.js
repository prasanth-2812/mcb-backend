"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.getCompany = getCompany;
exports.getCompanyJobs = getCompanyJobs;
const models_1 = require("../models");
async function getCompanies(req, res, next) {
    try {
        const companies = await models_1.Company.findAll({
            order: [['name', 'ASC']],
        });
        res.json(companies);
    }
    catch (e) {
        next(e);
    }
}
async function getCompany(req, res, next) {
    try {
        const company = await models_1.Company.findByPk(req.params.id);
        if (!company)
            return res.status(404).json({ message: 'Not found' });
        res.json(company);
    }
    catch (e) {
        next(e);
    }
}
async function getCompanyJobs(req, res, next) {
    try {
        const jobs = await models_1.Job.findAll({
            where: { companyId: req.params.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(jobs);
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=companies.controller.js.map