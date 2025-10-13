import { sequelize as sequelizeInstance, testConnection } from '../config/database';
export const sequelize = sequelizeInstance;
export { testConnection };

// Import models
import { User } from './User';
import { Job } from './Job';
import { Candidate } from './Candidate';
import { Application } from './Application';
import { SavedJob } from './SavedJob';
import { SavedCandidate } from './SavedCandidate';
import { Notification } from './Notification';
import { Company } from './Company';

// Define associations
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'savedJobs' });
User.hasMany(SavedJob, { foreignKey: 'userId', as: 'savedJobs' });

SavedCandidate.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });
SavedCandidate.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Candidate.hasMany(SavedCandidate, { foreignKey: 'candidateId', as: 'savedBy' });
User.hasMany(SavedCandidate, { foreignKey: 'userId', as: 'savedCandidates' });

Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Export models
export { User, Job, Candidate, Application, SavedJob, SavedCandidate, Notification, Company };
