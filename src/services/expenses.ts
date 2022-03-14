import { col, fn, literal, Op } from "sequelize";
import {
  ExpenseAttributes,
  ExpenseCreationAttributes,
} from "../model/expense.model";
import { Expense } from "../model";
import {
  DateNumber,
  DateString,
  formatDate,
  getOffsetDate,
  Interval,
  startOfHistory,
  getIntervalStartDates,
  getTimespan,
  getUnitInterval,
  getMonthShort,
} from "../utils/date";
import { LOCALE, CURRENCY as currency } from "../config";
import { roundNum } from "../utils/nums";

const getLocalAmount = (amount: number) =>
  amount.toLocaleString(LOCALE, {
    style: "currency",
    currency,
  });

const IntervalIdMap = {
  [Interval.Year]: (date: Date) => date.getFullYear(),
  [Interval.Month]: (date: Date, isLabel: boolean = false) =>
    isLabel ? getMonthShort(date) : date.getMonth(),
  [Interval.Day]: (date: Date) => date.getDate(),
};

const IntervalInfoMap = {
  [Interval.Year]: (d: Date, amount: number) =>
    `${d.getFullYear()} - ${getLocalAmount(amount)}`,
  [Interval.Month]: (d: Date, amount: number) =>
    `${formatDate(d, {
      month: DateString.Long,
      year: DateNumber.Numeric,
    })} - ${getLocalAmount(amount)}`,
  [Interval.Day]: (d: Date, amount: number) =>
    `${formatDate(d)} - ${getLocalAmount(amount)}`,
};

export const findExpenses = (date: string) => {
  const timespan = getTimespan(date);
  const startDate = timespan ? new Date(date) : startOfHistory;
  const endDate = getOffsetDate(startDate, timespan);

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

interface ChartParams {
  startDate: Date;
  endDate: Date;
  unitInterval: Interval;
}

const getChartDataFromDb = async ({
  startDate,
  endDate,
  unitInterval,
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
      [fn("date_trunc", unitInterval, col("date")), "date"],
      [fn("sum", col("amount")), "amount"],
    ],
    group: [fn("date_trunc", unitInterval, col("date"))],
    raw: true,
    order: literal("date ASC"),
  });

const getIntervalToChartDataMap =
  (expenses: Expense[], unitInterval: Interval) => (date: Date) => {
    const timestamp = date.getTime();
    const expenseFound = expenses.find(
      (item) => new Date(item.date).getTime() === timestamp
    );
    const idMapper = IntervalIdMap[unitInterval];
    const id = String(idMapper(date));
    const amount = expenseFound ? roundNum(expenseFound.amount) : 0;
    const label = idMapper(date, true);
    const infoMapper = IntervalInfoMap[unitInterval];
    const info = infoMapper(date, amount);

    return { id, amount, label, info };
  };

// TODO: breaking change - update frontend accordingly
// e.g. expenses/chart?date=2022-03 (date can be empty)
// also check/sanitize date if empty (can be empty string)
export const getExpensesChartData = async (date: string) => {
  const timespan = getTimespan(date);
  const unitInterval = getUnitInterval(date);
  const startDate = timespan ? new Date(date) : startOfHistory;
  const endDate = getOffsetDate(startDate, timespan);
  const dataFromDb = await getChartDataFromDb({
    startDate,
    endDate,
    unitInterval,
  });
  const dates = getIntervalStartDates(date, unitInterval);
  return dates.map(getIntervalToChartDataMap(dataFromDb, unitInterval));
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
