import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("takeLast", () => {
  test("take last when empty", () => {
    expect(streamless([]).takeLast(3).toArray()).toStrictEqual([]);
  });

  test("take last when count is 0", () => {
    expect(streamless([1, 2, 3]).takeLast(0).toArray()).toStrictEqual([]);
  });

  test("take last when count is more than number of inputs", () => {
    expect(streamless([1, 2, 3]).takeLast(5).toArray()).toStrictEqual([
      1, 2, 3,
    ]);
  });

  test("take last when count negative ", () => {
    expect(streamless([1, 2, 3]).takeLast(-1).toArray()).toStrictEqual([]);
  });

  test("take last when count less than array length ", () => {
    expect(streamless([1, 2, 3]).takeLast(2).toArray()).toStrictEqual([2, 3]);
  });
});
