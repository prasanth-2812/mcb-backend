import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  role: 'employee' | 'employer';
  skills?: string[] | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreation = Optional<UserAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public password!: string;
  public phone!: string | null;
  public role!: 'employee' | 'employer';
  public skills!: string[] | null;
  public resumeUrl!: string | null;
  public avatarUrl!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM('employee', 'employer'), allowNull: false },
  skills: { type: DataTypes.JSON, allowNull: true },
  resumeUrl: { type: DataTypes.STRING, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  tableName: 'users',
});
