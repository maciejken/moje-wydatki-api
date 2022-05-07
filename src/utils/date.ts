import moment from "moment-timezone";
import { LOCALE } from "../config";

export enum UnitOfTime {
  Year = "year",
  Month = "month",
  Day = "day",
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

export interface TimeInterval {
  id: string;
  label: string;
  interval: UnitOfTime;
  timestamp: number;
  week?: number;
  day?: number;
}

const intervals: UnitOfTime[] = [
  UnitOfTime.Year,
  UnitOfTime.Month,
  UnitOfTime.Day,
];

export const isDate = (date: string) => !isNaN(new Date(date).getTime());

export const getDatePrecision = (date: string) =>
  date?.split("-").filter(Boolean).length || 0;

export const getInterval = (date: string) => {
  const precision = getDatePrecision(date);
  return intervals[precision];
};

export const getTimeRange = (date: string) => {
  const precision = getDatePrecision(date);
  return intervals[precision - 1];
};

const getDateString = (date: Date) => {
  const [dateStr] = date.toISOString().split("T");
  return dateStr;
};

const padDate = (num: number) => String(num).padStart(2, "0");

const NumberToDateMap = {
  [UnitOfTime.Year]: (startDate: Date, num: number) =>
    `${startDate.getFullYear() + num}T00:00Z`,
  [UnitOfTime.Month]: (startDate: Date, num: number) =>
    `${startDate.getFullYear()}-${padDate(
      startDate.getMonth() + num + 1
    )}T00:00Z`,
  [UnitOfTime.Day]: (startDate: Date, num: number) =>
    `${startDate.getFullYear()}-${padDate(startDate.getMonth() + 1)}-${padDate(
      startDate.getDate() + num
    )}T00:00Z`,
};

const getNumberToTimeIntervalMap =
  (startDate: Date, interval: UnitOfTime) => (num: number) => {
    const numberToDateMapper = NumberToDateMap[interval];
    const utcString = numberToDateMapper(startDate, num);
    const date = new Date(utcString);
    const idMapper = IntervalIdMap[interval];
    const data: TimeInterval = {
      interval,
      timestamp: date.valueOf(),
    } as TimeInterval;
    data.id = String(idMapper(date));
    data.label = interval === UnitOfTime.Month ? getMonthShort(date) : data.id;
    if (interval === UnitOfTime.Day) {
      data.week = moment(date).isoWeek();
      data.day = moment(date).isoWeekday();
    }
    return { ...data };
  };

const IntervalCountMap = {
  [UnitOfTime.Year]: () => 6,
  [UnitOfTime.Month]: () => 12,
  [UnitOfTime.Day]: (date: Date) =>
    moment([date.getFullYear(), date.getMonth()]).daysInMonth(),
};

const IntervalIdMap = {
  [UnitOfTime.Year]: (date: Date) => "" + date.getFullYear(),
  [UnitOfTime.Month]: (date: Date) => "" + (date.getMonth() + 1),
  [UnitOfTime.Day]: (date: Date) => "" + date.getDate(),
};

const getOffsetDateString = (date: string, offset: number) => {
  const precision = getDatePrecision(date);
  const unitOfTime = intervals[precision - 1];
  const startDate = new Date(date);
  const nextDate = getOffsetDate(startDate, { offset, unitOfTime });
  const dateStr = getDateString(nextDate);
  return dateStr.split("-").slice(0, precision).join("-");
};

export const getNextDate = (date: string) => getOffsetDateString(date, 1);
export const getPrevDate = (date: string) => getOffsetDateString(date, -1);

export const getTimeIntervals = (date: string) => {
  const interval = getInterval(date);
  const startDate = date ? new Date(date) : startOfHistory;
  const countMapper = IntervalCountMap[interval];
  let count;
  if (countMapper) {
    count = countMapper(startDate);
  }
  const numbers = [];
  if (count) {
    for (let i = 0; i < count; i++) {
      numbers.push(i);
    }
    return numbers.map(getNumberToTimeIntervalMap(startDate, interval));
  } else {
    return null;
  }
};

export const startOfHistory = new Date("2021-01-01T00:00Z");
export const endOfTime = new Date("9999-12-31T23:59:59Z");

interface DateOptions {
  unitOfTime: UnitOfTime;
  offset: number;
}

export const getOffsetDate = (
  date: Date,
  { offset, unitOfTime }: DateOptions
): Date => {
  return unitOfTime
    ? moment(date).tz("UTC").add(offset, unitOfTime).toDate()
    : endOfTime;
};

export const formatDate = (
  date: Date,
  options: DateFormat = { dateStyle: DateStyle.Full }
) => new Intl.DateTimeFormat(LOCALE, options).format(date);

export const getMonthShort = (date: Date) =>
  formatDate(date, {
    month: DateString.Short,
  });

export const getYearAndMonthLong = (date: Date) =>
  formatDate(date, {
    month: DateString.Long,
    year: DateNumber.Numeric,
  });
