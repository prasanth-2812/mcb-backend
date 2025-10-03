import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface ApplicationAttributes {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string | null;
  resumeUrl?: string | null;
  appliedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ApplicationCreation = Optional<ApplicationAttributes, 'id' | 'appliedAt' | 'createdAt' | 'updatedAt'>;

export class Application extends Model<ApplicationAttributes, ApplicationCreation> implements ApplicationAttributes {
  public id!: string;
  public userId!: string;
  public jobId!: string;
  public status!: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  public coverLetter!: string | null;
  public resumeUrl!: string | null;
  public appliedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  jobId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'), defaultValue: 'pending' },
  coverLetter: { type: DataTypes.TEXT },
  resumeUrl: { type: DataTypes.STRING },
  appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'applications',
});
