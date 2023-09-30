import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(chainable.from().distinctUntilChanged().toArray()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .distinctUntilChanged((a, b) => a === b)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      chainable.from(1, 1, 2, 3, 3, 4).distinctUntilChanged().toArray(),
    ).toStrictEqual([1, 2, 3, 4]);
  });
});
