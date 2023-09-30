import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("skip", () => {
  test("skip 1", () => {
    expect(chainable.from(1, 2, 3).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(chainable.from(1, 2, 3).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(chainable.from(1, 2, 3).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(chainable.from(1, 2, 3).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
