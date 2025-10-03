import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface SavedJobAttributes {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SavedJobCreation = Optional<SavedJobAttributes, 'id' | 'savedAt' | 'createdAt' | 'updatedAt'>;

export class SavedJob extends Model<SavedJobAttributes, SavedJobCreation> implements SavedJobAttributes {
  public id!: string;
  public userId!: string;
  public jobId!: string;
  public savedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SavedJob.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  jobId: { type: DataTypes.STRING, allowNull: false },
  savedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'saved_jobs',
});
