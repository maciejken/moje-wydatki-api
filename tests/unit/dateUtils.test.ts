import { getOffsetDate, Interval } from "utils/date";

describe("date utils", () => {
  describe("getOffsetDate", () => {
    it("returns end of day", () => {
      const date = new Date('2022-03-15T00:00Z');
      const endOfDay = getOffsetDate(date, Interval.Day);
      expect(endOfDay.toISOString()).toEqual("2022-03-15T23:59:59.999Z");
    });
    it("returns end of month", () => {
      const date = new Date('2022-03-15T00:00Z');
      const endOfMonth = getOffsetDate(date, Interval.Month);
      expect(endOfMonth.toISOString()).toEqual("2022-03-31T23:59:59.999Z");
    });
    it("returns end of year", () => {
      const date = new Date('2022-03-15T00:00Z');
      const endOfYear = getOffsetDate(date, Interval.Year);
      expect(endOfYear.toISOString()).toEqual("2022-12-31T23:59:59.999Z");
    });
  });
});
