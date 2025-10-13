"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Application extends sequelize_1.Model {
    id;
    userId;
    jobId;
    status;
    coverLetter;
    resumeUrl;
    appliedAt;
    createdAt;
    updatedAt;
}
exports.Application = Application;
Application.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    jobId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'), defaultValue: 'pending' },
    coverLetter: { type: sequelize_1.DataTypes.TEXT },
    resumeUrl: { type: sequelize_1.DataTypes.STRING },
    appliedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: index_1.sequelize,
    tableName: 'applications',
});
//# sourceMappingURL=Application.js.map