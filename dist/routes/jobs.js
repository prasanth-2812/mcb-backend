"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const jobs_controller_1 = require("../controllers/jobs.controller");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/', jobs_controller_1.listJobs);
router.get('/:id', jobs_controller_1.getJob);
// Protected routes (authentication required)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('employer'), jobs_controller_1.createJob);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('employer'), jobs_controller_1.updateJob);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('employer'), jobs_controller_1.deleteJob);
exports.default = router;
//# sourceMappingURL=jobs.js.map