import { describe, test, expect } from "bun:test";
import { chainable } from "../../index.ts";

describe("takeLast", () => {
  test("take last when empty", () => {
    expect(chainable([]).takeLast(3).toArray()).toStrictEqual([]);
  });

  test("take last when count is 0", () => {
    expect(chainable([1, 2, 3]).takeLast(0).toArray()).toStrictEqual([]);
  });

  test("take last when count is more than number of inputs", () => {
    expect(chainable([1, 2, 3]).takeLast(5).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("take last when count negative ", () => {
    expect(chainable([1, 2, 3]).takeLast(-1).toArray()).toStrictEqual([]);
  });

  test("take last when count less than array length ", () => {
    expect(chainable([1, 2, 3]).takeLast(2).toArray()).toStrictEqual([2, 3]);
  });
});
