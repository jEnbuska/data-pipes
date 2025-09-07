import { describe, test, expect } from "bun:test";
import { chainable } from "../../chainable/chainable.ts";
import { pipe } from "../../pipe/pipe.ts";
import { countBy } from "./countBy.ts";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(
      chainable<number>([])
        .countBy((next) => next)
        .first(),
    ).toBe(0);
  });
  test("countBy with identity", () => {
    expect(
      chainable(1)
        .countBy((next) => next)
        .first(),
    ).toBe(1);
  });

  test("countBy by with selector identity", () => {
    expect(
      chainable({ value: 5 })
        .countBy((next) => next.value)
        .first(),
    ).toBe(5);
  });

  test("pipe - countBy", () => {
    const value = pipe(
      [1, 2, 3],
      countBy((next) => next),
    ).first();
    expect(value).toBe(6);
  });
});
