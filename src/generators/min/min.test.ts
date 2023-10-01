import { describe, test, expect } from "bun:test";
import { chainable, min } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("min", () => {
  const numbers = [2, 1, 3, 5, 4];
  test("empty", () => {
    expect(
      chainable<number>()
        .max((v) => v)
        .first(-1),
    ).toBe(-1);
  });

  test("by value", () => {
    expect(
      chainable<number>(numbers)
        .min((v) => v)
        .first(),
    ).toBe(1);
  });

  test("by module 4", () => {
    expect(
      chainable<number>(numbers)
        .min((v) => v % 4)
        .first(),
    ).toBe(4);
  });

  test("pipe - min", () => {
    expect(
      pipe(
        [2, 1, 3, 4],
        min((v) => v),
      ).first(),
    ).toBe(1);
  });
});
