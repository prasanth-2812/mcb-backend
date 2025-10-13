"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, _req, res, _next) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
}
//# sourceMappingURL=errorHandler.js.map