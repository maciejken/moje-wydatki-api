import { col, fn, literal, Op } from "sequelize";
import {
  ExpenseAttributes,
  ExpenseCreationAttributes,
} from "model/expense.model";
import { Expense } from "../model";
import { getDateBoundaries, Interval } from "../utils/date";

interface ExpenseQuery {
  year?: string;
  month?: string;
}

export const findExpenses = (query: ExpenseQuery) => {
  const year = query.year ? parseInt(query.year) : new Date().getFullYear();
  const interval = query.month ? Interval.Month : Interval.Year;
  const month = query.month ? parseInt(query.month) - 1 : 0;
  const [startDate, endDate] = getDateBoundaries({ year, month, interval });

  return Expense.findAll({
    where: {
      date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    order: [
      ["date", "desc"],
      ["amount", "desc"],
    ],
  });
};

export const getMonthlyExpenses = async () => {
  const months = await Expense.findAll({
    where: { isPrivate: false },
    attributes: [
      [fn("date_trunc", "month", col("date")), "date"],
      [fn("sum", col("amount")), "amount"],
    ],
    group: [fn("date_trunc", "month", col("date"))],
    raw: true,
    order: literal("date ASC"),
  });
  const years = months.map((month) => new Date(month.date).getFullYear());
  const uniqueYears = [...new Set(years)];
  return uniqueYears.map((year) => ({
    id: "" + year,
    months: months
      .filter((month) => new Date(month.date).getFullYear() === year)
      .map((month) => ({
        id: "" + new Date(month.date).getMonth(),
        total: month.amount,
      })),
  }));
};

export const createExpense = (expenseData: ExpenseCreationAttributes) =>
  Expense.create(expenseData);

export const destroyExpense = (expenseId: string) =>
  Expense.destroy({ where: { id: parseInt(expenseId) } });

export const updateExpense = (
  expenseId: string,
  expenseUpdate: ExpenseAttributes
) =>
  Expense.findByPk(expenseId).then((expense) => expense?.update(expenseUpdate));
