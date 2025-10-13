"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = exports.Notification = exports.SavedJob = exports.Application = exports.Candidate = exports.Job = exports.User = exports.testConnection = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "testConnection", { enumerable: true, get: function () { return database_1.testConnection; } });
exports.sequelize = database_1.sequelize;
// Import models
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Job_1 = require("./Job");
Object.defineProperty(exports, "Job", { enumerable: true, get: function () { return Job_1.Job; } });
const Candidate_1 = require("./Candidate");
Object.defineProperty(exports, "Candidate", { enumerable: true, get: function () { return Candidate_1.Candidate; } });
const Application_1 = require("./Application");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return Application_1.Application; } });
const SavedJob_1 = require("./SavedJob");
Object.defineProperty(exports, "SavedJob", { enumerable: true, get: function () { return SavedJob_1.SavedJob; } });
const Notification_1 = require("./Notification");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return Notification_1.Notification; } });
const Company_1 = require("./Company");
Object.defineProperty(exports, "Company", { enumerable: true, get: function () { return Company_1.Company; } });
// Define associations
SavedJob_1.SavedJob.belongsTo(Job_1.Job, { foreignKey: 'jobId', as: 'job' });
SavedJob_1.SavedJob.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
Job_1.Job.hasMany(SavedJob_1.SavedJob, { foreignKey: 'jobId', as: 'savedJobs' });
User_1.User.hasMany(SavedJob_1.SavedJob, { foreignKey: 'userId', as: 'savedJobs' });
Application_1.Application.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
Application_1.Application.belongsTo(Job_1.Job, { foreignKey: 'jobId', as: 'job' });
User_1.User.hasMany(Application_1.Application, { foreignKey: 'userId', as: 'applications' });
Job_1.Job.hasMany(Application_1.Application, { foreignKey: 'jobId', as: 'applications' });
Notification_1.Notification.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
User_1.User.hasMany(Notification_1.Notification, { foreignKey: 'userId', as: 'notifications' });
//# sourceMappingURL=index.js.map