"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Job extends sequelize_1.Model {
    id;
    title;
    company;
    companyId;
    location;
    type;
    category;
    isRemote;
    description;
}
exports.Job = Job;
Job.init({
    id: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    company: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    companyId: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    location: { type: sequelize_1.DataTypes.STRING },
    type: { type: sequelize_1.DataTypes.STRING },
    category: { type: sequelize_1.DataTypes.STRING },
    isRemote: { type: sequelize_1.DataTypes.BOOLEAN },
    description: { type: sequelize_1.DataTypes.TEXT },
}, {
    sequelize: index_1.sequelize,
    tableName: 'jobs',
});
//# sourceMappingURL=Job.js.map