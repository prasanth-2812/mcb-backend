import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  role: 'employee' | 'employer';
  companyName?: string | null;
  skills?: string[] | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreation = Optional<UserAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare name: string;
  declare password: string;
  declare phone: string | null;
  declare role: 'employee' | 'employer';
  declare companyName: string | null;
  declare skills: string[] | null;
  declare resumeUrl: string | null;
  declare avatarUrl: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM('employee', 'employer'), allowNull: false },
  companyName: { type: DataTypes.STRING, allowNull: true },
  skills: { type: DataTypes.JSON, allowNull: true },
  resumeUrl: { type: DataTypes.STRING, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  tableName: 'users',
});
