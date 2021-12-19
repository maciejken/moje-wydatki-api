import { col, fn, literal, Op, WhereValue } from "sequelize";
import {
  ExpenseAttributes,
  ExpenseCreationAttributes,
} from "model/expense.model";
import { Expense } from "../model";
import {
  formatDate,
  getDateRange,
  getDateString,
  getIntervalCount,
  getParentInterval,
  Interval,
} from "../utils/date";

interface ExpenseQuery {
  date: string;
  interval: Interval;
}

export const findExpenses = ({ date, interval }: ExpenseQuery) => {
  const [startDate, endDate] = getDateRange({ date, interval });

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

export const getExpensesChartData = async ({
  date,
  interval,
}: ExpenseQuery) => {
  const where: WhereValue = { isPrivate: false };
  let itemCount = getIntervalCount({ date, interval });
  const parentInterval = getParentInterval(interval);
  if (parentInterval) {
    const [startDate, endDate] = getDateRange({
      date,
      interval: parentInterval,
    });
    where.date = {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    };
  }
  const itemsFromDb = await Expense.findAll({
    where,
    attributes: [
      [fn("date_trunc", interval, col("date")), "date"],
      [fn("sum", col("amount")), "amount"],
    ],
    group: [fn("date_trunc", interval, col("date"))],
    raw: true,
    order: literal("date ASC"),
  });
  if (!parentInterval) {
    return itemsFromDb.map((item) => {
      const x = "" + new Date(item.date).getFullYear();
      const y = Math.round(100 * item.amount) / 100;
      return { x, y, label: x };
    });
  }
  const isMonth = interval === Interval.Month;
  return Array.from(new Array(itemCount)).map((el, index) => {
    const chartDate = new Date(date);
    const year = chartDate.getFullYear();
    const month = isMonth ? index : chartDate.getMonth();
    const day = isMonth ? 1 : index + 1;
    const itemDate = isMonth
      ? new Date(year, month, day)
      : new Date(year, month, index + 1);
    const indexShift = isMonth ? 0 : 1;
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const x = "" + (index + indexShift);
    const itemFromDb = itemsFromDb.find(
      (item) => getDateString(item.date) === `${year}-${mm}-${dd}`
    );
    const y = itemFromDb ? Math.round(100 * itemFromDb.amount) / 100 : 0;
    const label = isMonth ? formatDate(itemDate, { month: "short" }) : x;
    return { x, y, label };
  });
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
