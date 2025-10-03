import { sequelize as sequelizeInstance } from '../config/database';
export const sequelize = sequelizeInstance;
export * from './User';
export * from './Job';
export * from './Candidate';
export * from './Application';
export * from './SavedJob';
export * from './Notification';
export * from './Company';
