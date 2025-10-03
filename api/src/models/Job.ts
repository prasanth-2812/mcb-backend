import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface JobAttributes {
  id: string;
  title: string;
  company: string;
  companyId?: string | null;
  location?: string | null;
  type?: string | null;
  category?: string | null;
  isRemote?: boolean | null;
  description?: string | null;
}

export type JobCreation = Optional<JobAttributes, 'id'>;

export class Job extends Model<JobAttributes, JobCreation> implements JobAttributes {
  declare id: string;
  declare title: string;
  declare company: string;
  declare companyId: string | null;
  declare location: string | null;
  declare type: string | null;
  declare category: string | null;
  declare isRemote: boolean | null;
  declare description: string | null;
}

Job.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  companyId: { type: DataTypes.UUID, allowNull: true },
  location: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  isRemote: { type: DataTypes.BOOLEAN },
  description: { type: DataTypes.TEXT },
}, {
  sequelize,
  tableName: 'jobs',
});
