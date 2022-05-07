import { getNextDate, getPrevDate, getTimeIntervals } from "../utils/date";

export const getIntervalsByDate = (date: string) => {
  return {
    date,
    intervals: getTimeIntervals(date),
    nextDate: getNextDate(date),
    prevDate: getPrevDate(date),
  };
};
