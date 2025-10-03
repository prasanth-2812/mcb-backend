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
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare website: string | null;
  declare logo: string | null;
  declare industry: string | null;
  declare size: string | null;
  declare location: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
