"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Candidate extends sequelize_1.Model {
    id;
    name;
    jobTitle;
    location;
}
exports.Candidate = Candidate;
Candidate.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    jobTitle: { type: sequelize_1.DataTypes.STRING },
    location: { type: sequelize_1.DataTypes.STRING },
}, {
    sequelize: index_1.sequelize,
    tableName: 'candidates',
});
//# sourceMappingURL=Candidate.js.map