import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = source([1, 2, 3]).reverse().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
