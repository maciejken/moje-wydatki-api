import crypto from "crypto";
import { DataTypes, Model, Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  salt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export interface UserModel extends Model<UserAttributes>, UserAttributes {};

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public salt!: string
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static generateSalt() {
      return crypto.randomBytes(16).toString("base64");
    }

    static encryptPassword(plainTextPwd: string, salt: string) {
      return  crypto
        .createHash("RSA-SHA256")
        .update(plainTextPwd)
        .update(salt)
        .digest("hex");
    }

    isCorrectPassword(enteredPassword: string) {
      return User.encryptPassword(enteredPassword, this.salt) === this.password;
    }
  }

export const UserSettings = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  salt: {
    type: DataTypes.STRING,
  },
};

export default User;
