"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const applications_controller_1 = require("../controllers/applications.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', applications_controller_1.getUserApplications);
router.post('/', applications_controller_1.applyToJob);
router.get('/:id', applications_controller_1.getApplication);
router.put('/:id', applications_controller_1.updateApplication);
router.delete('/:id', applications_controller_1.withdrawApplication);
router.get('/job/:jobId', applications_controller_1.getJobApplications);
exports.default = router;
//# sourceMappingURL=applications.js.map