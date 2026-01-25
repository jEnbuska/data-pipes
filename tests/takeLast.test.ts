import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";

describe("takeLast", () => {
  test("take last when empty", () => {
    expect(yielded([]).takeLast(3).toArray()).toStrictEqual([]);
  });

  test("take last when count is 0", () => {
    expect(yielded([1, 2, 3]).takeLast(0).toArray()).toStrictEqual([]);
  });

  test("take last when count is more than number of inputs", () => {
    expect(yielded([1, 2, 3]).takeLast(5).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("take last when count negative ", () => {
    expect(yielded([1, 2, 3]).takeLast(-1).toArray()).toStrictEqual([]);
  });

  test("take last when count less than array length ", () => {
    expect(yielded([1, 2, 3]).takeLast(2).toArray()).toStrictEqual([2, 3]);
  });
});
