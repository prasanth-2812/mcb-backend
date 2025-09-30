import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface CandidateAttributes {
  id: number;
  name: string;
  jobTitle?: string | null;
  location?: string | null;
}

export type CandidateCreation = Optional<CandidateAttributes, 'id'>;

export class Candidate extends Model<CandidateAttributes, CandidateCreation> implements CandidateAttributes {
  public id!: number;
  public name!: string;
  public jobTitle!: string | null;
  public location!: string | null;
}

Candidate.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
  name: { type: DataTypes.STRING, allowNull: false },
  jobTitle: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
}, {
  sequelize,
  tableName: 'candidates',
});
