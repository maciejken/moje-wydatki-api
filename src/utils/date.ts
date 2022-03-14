import moment from "moment";
import { LOCALE } from "../config";

export enum Interval {
  Year = "year",
  Month = "month",
  Day = "day",
}

interface TimePeriod {
  date: string;
  interval: Interval;
}

export enum DateString {
  Long = "long",
  Short = "short",
}

export enum DateNumber {
  Numeric = "numeric",
  TwoDigit = "2-digit",
}

export enum DateStyle {
  Full = "full",
  Short = "short",
}

interface DateFormat {
  day?: DateNumber;
  hour12?: boolean;
  month?: DateString | DateNumber;
  dateStyle?: DateStyle;
  timeZone?: string;
  timeZoneName?: DateString;
  year?: DateNumber;
}

export const formatDate = (
  date: Date,
  options: DateFormat = { dateStyle: DateStyle.Full }
) => new Intl.DateTimeFormat(LOCALE, options).format(date);

export const getIntervalCount = ({ date, interval }: TimePeriod): number => {
  const d = new Date(date);
  switch (interval) {
    case Interval.Month:
      return 12;
    case Interval.Day:
      return moment([d.getFullYear(), d.getMonth()]).daysInMonth();
    default:
      return 0;
  }
};

const intervals: Interval[] = [Interval.Year, Interval.Month, Interval.Day];

export const getDatePrecision = (date: string) =>
  date?.split("-").filter(Boolean).length || 0;

export const getUnitInterval = (date: string) => {
  const precision = getDatePrecision(date);
  return intervals[precision];
};

export const getTimespan = (date: string) => {
  const precision = getDatePrecision(date);
  return intervals[precision - 1];
};

const padDate = (num: number) => String(num).padStart(2, "0");

const NumberToDateMap = {
  [Interval.Year]: (startDate: Date, num: number) =>
    new Date(`${startDate.getFullYear() + num}T00:00Z`),
  [Interval.Month]: (startDate: Date, num: number) =>
    new Date(`${startDate.getFullYear()}-${padDate(startDate.getMonth() + 1 + num)}T00:00Z`),
  [Interval.Day]: (startDate: Date, num: number) =>
    new Date(
      `${startDate.getFullYear()}-${padDate(startDate.getMonth())}-${
        padDate(startDate.getDate() + num)
      }T00:00Z`
    ),
};

const getNumberToDateMap =
  (startDate: Date, unitInterval: Interval) => (num: number) => {
    const numberToDateMapper = NumberToDateMap[unitInterval];
    return numberToDateMapper(startDate, num);
  };

export const getIntervalStartDates = (date: string, unitInterval: Interval) => {
  const startDate = date ? new Date(date) : startOfHistory;
  let count;
  if (unitInterval === Interval.Year) {
    count = 6;
  } else if (unitInterval === Interval.Month) {
    count = 12;
  } else if (unitInterval === Interval.Day) {
    count = moment([
      startDate.getFullYear(),
      startDate.getMonth(),
    ]).daysInMonth();
  } else {
    count = 0;
  }
  const numbers = [];
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      numbers.push(i);
    }
    return numbers.map(getNumberToDateMap(startDate, unitInterval));
  } else {
    return [];
  }
};

export const startOfHistory = new Date("2021-01-01T00:00Z");
export const endOfTime = new Date("9999-12-31T23:59:59Z");

export const getOffsetDate = (date: Date, timespan: Interval): Date =>
  timespan ? moment(date).endOf(timespan).toDate() : endOfTime;

export const getMonthShort = (date: Date) =>
  formatDate(date, {
    month: DateString.Short,
  });

// deprecated
export const getDateString = (date: string) => {
  const [head] = date.split("T");
  return new Date(`${head}T00:00Z`).toISOString().slice(0, 10);
};
