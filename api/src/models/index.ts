import { sequelize as sequelizeInstance } from '../config/database';
export const sequelize = sequelizeInstance;
export * from './User';
export * from './Job';
export * from './Candidate';
export * from './Application';
export * from './SavedJob';
export * from './Notification';
export * from './Company';

// Import models for associations
import { User } from './User';
import { Job } from './Job';
import { Application } from './Application';
import { SavedJob } from './SavedJob';
import { Notification } from './Notification';
import { Company } from './Company';

// Define associations
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

User.hasMany(SavedJob, { foreignKey: 'userId', as: 'savedJobs' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'savedJobs' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'companyInfo' });
