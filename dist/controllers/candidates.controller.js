"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCandidates = listCandidates;
exports.getCandidate = getCandidate;
exports.createCandidate = createCandidate;
exports.updateCandidate = updateCandidate;
exports.deleteCandidate = deleteCandidate;
const models_1 = require("../models");
async function listCandidates(_req, res, next) {
    try {
        const candidates = await models_1.Candidate.findAll();
        res.json(candidates);
    }
    catch (e) {
        next(e);
    }
}
async function getCandidate(req, res, next) {
    try {
        const candidate = await models_1.Candidate.findByPk(req.params.id);
        if (!candidate)
            return res.status(404).json({ message: 'Not found' });
        res.json(candidate);
    }
    catch (e) {
        next(e);
    }
}
async function createCandidate(req, res, next) {
    try {
        const created = await models_1.Candidate.create(req.body);
        res.status(201).json(created);
    }
    catch (e) {
        next(e);
    }
}
async function updateCandidate(req, res, next) {
    try {
        const candidate = await models_1.Candidate.findByPk(req.params.id);
        if (!candidate)
            return res.status(404).json({ message: 'Not found' });
        await candidate.update(req.body);
        res.json(candidate);
    }
    catch (e) {
        next(e);
    }
}
async function deleteCandidate(req, res, next) {
    try {
        const deleted = await models_1.Candidate.destroy({ where: { id: req.params.id } });
        res.json({ deleted });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=candidates.controller.js.map