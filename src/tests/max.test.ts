import { describe, test, expect } from "bun:test";
import { chain, max } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";

describe("max", () => {
  const numbers = [1, 2, 3, 5, 4];
  test("empty", () => {
    expect(
      chain<number>([])
        .max((v) => v)
        .first(-1),
    ).toBe(-1);
  });

  test("by value", () => {
    expect(
      chain<number>(numbers)
        .max((v) => v)
        .first(),
    ).toBe(5);
  });

  test("by module 4", () => {
    expect(
      chain<number>(numbers)
        .max((v) => v % 4)
        .first(),
    ).toBe(3);
  });

  test("pipe - max", () => {
    expect(
      pipe(
        [1, 2, 4, 3],
        max((n) => n),
      ).first(),
    ).toBe(4);
  });
});
