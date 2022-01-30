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

const intervals = [Interval.Year, Interval.Month, Interval.Day];

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

export const getParentInterval = (interval: Interval) => {
  const index = intervals.indexOf(interval);
  return intervals[index - 1];
};

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

export const getDateRange = ({ date, interval }: TimePeriod): Date[] => {
  const startDate = moment(date).startOf(interval).toDate();
  const endDate = moment(startDate).endOf(interval).toDate();

  return [startDate, endDate];
};

export const getDateString = (date: string) => {
  return new Date(date).toISOString().slice(0, 10);
};
