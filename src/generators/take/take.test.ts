import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("take", () => {
  test("take 1", () => {
    expect(chainable([1, 2, 3]).take(1).toArray()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(chainable([1, 2, 3]).take(2).toArray()).toStrictEqual([1, 2]);
  });

  test("take none", () => {
    expect(chainable([1, 2, 3]).take(0).toArray()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(chainable([1, 2, 3]).take(-1).toArray()).toStrictEqual([]);
  });
});
