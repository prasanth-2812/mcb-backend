import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'employee' | 'employer';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreation = Optional<UserAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public phone!: string | null;
  public role!: 'employee' | 'employer';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM('employee', 'employer'), allowNull: false },
}, {
  sequelize,
  tableName: 'users',
});
