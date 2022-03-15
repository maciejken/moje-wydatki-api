import moment from "moment-timezone";
import { LOCALE } from "../config";

export enum Interval {
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
    `${startDate.getFullYear() + num}T00:00Z`,
  [Interval.Month]: (startDate: Date, num: number) =>
    `${startDate.getFullYear()}-${padDate(
      startDate.getMonth() + num + 1
    )}T00:00Z`,
  [Interval.Day]: (startDate: Date, num: number) =>
    `${startDate.getFullYear()}-${padDate(startDate.getMonth() + 1)}-${padDate(
      startDate.getDate() + num
    )}T00:00Z`,
};

const getNumberToDateMap =
  (startDate: Date, unitInterval: Interval) => (num: number) => {
    const numberToDateMapper = NumberToDateMap[unitInterval];
    const utcString = numberToDateMapper(startDate, num);
    return new Date(utcString);
  };

const IntervalCountMap = {
  [Interval.Year]: () => 6,
  [Interval.Month]: () => 12,
  [Interval.Day]: (date: Date) =>
    moment([date.getFullYear(), date.getMonth()]).daysInMonth(),
};

export const getIntervalStartDates = (date: string, unitInterval: Interval) => {
  const startDate = date ? new Date(date) : startOfHistory;
  const countMapper = IntervalCountMap[unitInterval];
  const count = countMapper(startDate);
  const numbers = [];
  if (count) {
    for (let i = 0; i < count; i++) {
      numbers.push(i);
    }
    return numbers.map(getNumberToDateMap(startDate, unitInterval));
  } else {
    return null;
  }
};

export const startOfHistory = new Date("2021-01-01T00:00Z");
export const endOfTime = new Date("9999-12-31T23:59:59Z");

export const getOffsetDate = (date: Date, timespan: Interval): Date =>
  timespan ? moment(date).tz("UTC").endOf(timespan).toDate() : endOfTime;

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
