import { Dialect, Sequelize } from "sequelize";

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
import User, { UserInstance, UserSettings } from "./user.model";
import Expense, { ExpenseSettings } from "./expense.model";

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
  UserSettings,
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

Expense.init(
  ExpenseSettings,
  {
    sequelize,
    tableName: Tables.Expense
  },
);

sequelize.sync().then(() => {
  logger.info(`database synced`);
});

export {
  Expense,
  User,
}

