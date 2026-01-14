import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = yielded([1, 2, 3]).toReverse().collect();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
