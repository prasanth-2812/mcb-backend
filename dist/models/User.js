"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class User extends sequelize_1.Model {
    id;
    email;
    name;
    password;
    phone;
    role;
    companyName;
    skills;
    resumeUrl;
    avatarUrl;
    createdAt;
    updatedAt;
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    role: { type: sequelize_1.DataTypes.ENUM('employee', 'employer'), allowNull: false },
    companyName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    skills: { type: sequelize_1.DataTypes.JSON, allowNull: true },
    resumeUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    avatarUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    sequelize: index_1.sequelize,
    tableName: 'users',
});
//# sourceMappingURL=User.js.map