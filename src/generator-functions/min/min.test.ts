import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("min", () => {
  const numbers = [2, 1, 3, 5, 4];
  test("empty", () => {
    expect(
      pipe<number>()
        .max((v) => v)
        .toSingle(-1),
    ).toBe(-1);
  });

  test("by value", () => {
    expect(
      pipe<number>(numbers)
        .min((v) => v)
        .toSingle(),
    ).toBe(1);
  });

  test("by module 4", () => {
    expect(
      pipe<number>(numbers)
        .min((v) => v % 4)
        .toSingle(),
    ).toBe(4);
  });
});
