import moment from "moment";

export enum Interval {
  Year = "year",
  Month = "month",
}

interface TimePeriod {
  year: number;
  month: number;
  interval: Interval;
}

export const getDateBoundaries = ({ year, month, interval }: TimePeriod): Date[] => {
  const startDate = moment([year, month]).toDate();
  const endDate = moment(startDate).endOf(interval).toDate();

  return [startDate, endDate];
}