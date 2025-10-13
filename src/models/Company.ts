import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface CompanyAttributes {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CompanyCreation = Optional<CompanyAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Company extends Model<CompanyAttributes, CompanyCreation> implements CompanyAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public website!: string | null;
  public logo!: string | null;
  public industry!: string | null;
  public size!: string | null;
  public location!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  website: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  size: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
}, {
  sequelize,
  tableName: 'companies',
});
