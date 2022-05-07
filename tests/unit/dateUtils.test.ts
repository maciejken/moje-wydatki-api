import { getOffsetDate, UnitOfTime } from "utils/date";

describe("date utils", () => {
  describe("getOffsetDate", () => {
    it("returns end of day", () => {
      const date = new Date("2022-03-15T00:00Z");
      const endOfDay = getOffsetDate(date, {
        offset: 1,
        unitOfTime: UnitOfTime.Day,
      });
      expect(endOfDay.toISOString()).toEqual("2022-03-16T00:00:00.000Z");
    });
    it("returns end of month", () => {
      const date = new Date("2022-05-01T00:00Z");
      const endOfMonth = getOffsetDate(date, {
        offset: 1,
        unitOfTime: UnitOfTime.Month,
      });
      expect(endOfMonth.toISOString()).toEqual("2022-06-01T00:00:00.000Z");
    });
    it("returns end of year", () => {
      const date = new Date("2022-01-01T00:00Z");
      const endOfYear = getOffsetDate(date, {
        offset: 1,
        unitOfTime: UnitOfTime.Year,
      });
      expect(endOfYear.toISOString()).toEqual("2023-01-01T00:00:00.000Z");
    });
  });
});
