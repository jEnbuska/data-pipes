import { describe, test, expect } from "bun:test";
import { chainable, distinctUntilChanged } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(chainable().distinctUntilChanged().toArray()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      chainable([1, 2, 3])
        .distinctUntilChanged((a, b) => a === b)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      chainable([1, 1, 2, 3, 3, 4]).distinctUntilChanged().toArray(),
    ).toStrictEqual([1, 2, 3, 4]);
  });

  test("pipe - distinctUntilChanged using modulo 3", () => {
    expect(
      pipe(
        [1, 2, 5, 8, 3],
        distinctUntilChanged((a, b) => a % 3 === b % 3),
      ).toArray(),
    ).toStrictEqual([1, 2, 3]);
  });
});
