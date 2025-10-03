import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  role: 'employee' | 'employer';
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
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
  declare resetPasswordToken: string | null;
  declare resetPasswordExpires: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'employee' },
  resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  tableName: 'users',
});
