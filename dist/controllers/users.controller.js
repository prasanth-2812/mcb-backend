"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const models_1 = require("../models");
async function listUsers(_req, res, next) {
    try {
        const users = await models_1.User.findAll();
        res.json(users);
    }
    catch (e) {
        next(e);
    }
}
async function getUser(req, res, next) {
    try {
        const user = await models_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'Not found' });
        res.json(user);
    }
    catch (e) {
        next(e);
    }
}
async function createUser(req, res, next) {
    try {
        const created = await models_1.User.create(req.body);
        res.status(201).json(created);
    }
    catch (e) {
        next(e);
    }
}
async function updateUser(req, res, next) {
    try {
        const user = await models_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'Not found' });
        await user.update(req.body);
        res.json(user);
    }
    catch (e) {
        next(e);
    }
}
async function deleteUser(req, res, next) {
    try {
        const deleted = await models_1.User.destroy({ where: { id: req.params.id } });
        res.json({ deleted });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=users.controller.js.map