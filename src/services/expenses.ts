import { col, fn, literal, Op } from "sequelize";
import {
  ExpenseAttributes,
  ExpenseCreationAttributes,
} from "../model/expense.model";
import { Expense } from "../model";
import {
  formatDate,
  getOffsetDate,
  UnitOfTime,
  startOfHistory,
  getTimeRange,
  getInterval,
  getYearAndMonthLong,
  TimeInterval,
} from "../utils/date";
import { LOCALE, CURRENCY as currency } from "../config";
import { roundNum } from "../utils/nums";
import { getIntervalsByDate } from "./calendar";

const getLocalAmount = (amount: number) =>
  amount.toLocaleString(LOCALE, {
    style: "currency",
    currency,
  });

const IntervalInfoMap = {
  [UnitOfTime.Year]: (d: Date, amount: number) =>
    `${d.getFullYear()} - ${getLocalAmount(amount)}`,
  [UnitOfTime.Month]: (d: Date, amount: number) =>
    `${getYearAndMonthLong(d)} - ${getLocalAmount(amount)}`,
  [UnitOfTime.Day]: (d: Date, amount: number) =>
    `${formatDate(d)} - ${getLocalAmount(amount)}`,
};

export const findExpenses = (date: string) => {
  const unitOfTime = getTimeRange(date);
  const startDate = unitOfTime ? new Date(date) : startOfHistory;
  const endDate = getOffsetDate(startDate, { offset: 1, unitOfTime });

  return Expense.findAll({
    where: {
      date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    order: [
      ["date", "desc"],
      ["amount", "desc"],
    ],
  });
};

interface ChartParams {
  startDate: Date;
  endDate: Date;
  interval: UnitOfTime;
}

const getChartDataFromDb = async ({
  startDate,
  endDate,
  interval,
}: ChartParams) =>
  Expense.findAll({
    where: {
      date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
      isPrivate: false,
    },
    attributes: [
      [fn("date_trunc", interval, col("date")), "date"],
      [fn("sum", col("amount")), "amount"],
    ],
    group: [fn("date_trunc", interval, col("date"))],
    raw: true,
    order: literal("date ASC"),
  });

interface ChartDataPoint extends TimeInterval {
  amount: number;
  info: string;
}

const getTimeIntervalToChartDataMap =
  (amountByDate: { [key: number]: number }) => (d: TimeInterval) => {
    const data: ChartDataPoint = { ...d } as ChartDataPoint;
    const amount = amountByDate[d.timestamp] || 0;
    data.amount = roundNum(amount);
    const infoMapper = IntervalInfoMap[d.interval];
    data.info = infoMapper(new Date(d.timestamp), data.amount);
    return { ...data };
  };

export const getExpensesChartData = async (date: string) => {
  const unitOfTime = getTimeRange(date);
  const interval = getInterval(date);
  const startDate = unitOfTime ? new Date(date) : startOfHistory;
  const endDate = getOffsetDate(startDate, { offset: 1, unitOfTime });
  const dataFromDb = await getChartDataFromDb({
    startDate,
    endDate,
    interval,
  });
  const amountByDate: { [key: number]: number } = {};
  let totalAmount = 0;
  for (const item of dataFromDb) {
    const timestamp = new Date(item.date).getTime();
    amountByDate[timestamp] = item.amount;
    totalAmount += item.amount;
  }
  const data = getIntervalsByDate(date);
  const infoMapper = IntervalInfoMap[unitOfTime];
  const info = infoMapper && infoMapper(startDate, totalAmount);
  return {
    ...data,
    info,
    intervals: data.intervals?.map(getTimeIntervalToChartDataMap(amountByDate)),
  };
};

export const createExpense = (expenseData: ExpenseCreationAttributes) =>
  Expense.create(expenseData);

export const bulkCreateExpenses = (expenses: ExpenseAttributes[]) =>
  Expense.bulkCreate(expenses);

export const destroyExpense = (expenseId: string) =>
  Expense.destroy({ where: { id: parseInt(expenseId) } });

export const updateExpense = (
  expenseId: string,
  expenseUpdate: ExpenseAttributes
) =>
  Expense.findByPk(expenseId).then((expense) => expense?.update(expenseUpdate));
