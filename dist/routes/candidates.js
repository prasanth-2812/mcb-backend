"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidates_controller_1 = require("../controllers/candidates.controller");
const router = (0, express_1.Router)();
router.get('/', candidates_controller_1.listCandidates);
router.get('/:id', candidates_controller_1.getCandidate);
router.post('/', candidates_controller_1.createCandidate);
router.put('/:id', candidates_controller_1.updateCandidate);
router.delete('/:id', candidates_controller_1.deleteCandidate);
exports.default = router;
//# sourceMappingURL=candidates.js.map