import { DataTypes, Model, Optional } from "sequelize";

export interface ExpenseAttributes {
  id: number;
  title: string;
  amount: number;
  date: string;
  userId: number;
  isPrivate: boolean;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseCreationAttributes
  extends Optional<ExpenseAttributes, "id"> {}

export interface ExpenseInstance
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>,
    ExpenseAttributes {}

export interface ExpenseModel
  extends Model<ExpenseAttributes>,
    ExpenseAttributes {}

class Expense
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  public id!: number;
  public title!: string;
  public amount!: number;
  public date!: string;
  public categoryId!: string;
  public userId!: number;
  public isPrivate!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const ExpenseSettings = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.REAL,
  },
  date: {
    type: DataTypes.DATE,
  },
  categoryId: {
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
  },
};

export default Expense;
