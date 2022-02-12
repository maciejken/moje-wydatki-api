import { getDateString } from "utils/date";

describe("utils", () => {
  describe("getDateString", () => {
    it("returns correct date string", () => {
      const dateStr = getDateString('2022-02-12T00:00:00.000Z');
      expect(dateStr).toEqual("2022-02-12");
    });
  });
});
