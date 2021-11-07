import { DataTypes, Dialect, Sequelize } from "sequelize";

import getLogger from "../lib/getLogger";
import {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_LOGGING,
  DB_DIALECT,
} from "../config";
import { Tables } from "./tables.enum";
import User, { UserInstance } from "./user.model";

const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  logging: DB_LOGGING,
  dialect: DB_DIALECT as Dialect,
});

const logger = getLogger('model');

User.init(
  {
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
  },
  {
    sequelize,
    tableName: Tables.User    
  }
);

const setSaltAndPassword = (user: UserInstance) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

sequelize.sync().then(() => {
  logger.info(`database synced`);
});

export {
  User,
}

