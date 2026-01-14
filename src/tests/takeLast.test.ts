import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("takeLast", () => {
  test("take last when empty", () => {
    expect(yielded([]).takeLast(3).collect()).toStrictEqual([]);
  });

  test("take last when count is 0", () => {
    expect(yielded([1, 2, 3]).takeLast(0).collect()).toStrictEqual([]);
  });

  test("take last when count is more than number of inputs", () => {
    expect(yielded([1, 2, 3]).takeLast(5).collect()).toStrictEqual([1, 2, 3]);
  });

  test("take last when count negative ", () => {
    expect(yielded([1, 2, 3]).takeLast(-1).collect()).toStrictEqual([]);
  });

  test("take last when count less than array length ", () => {
    expect(yielded([1, 2, 3]).takeLast(2).collect()).toStrictEqual([2, 3]);
  });
});
