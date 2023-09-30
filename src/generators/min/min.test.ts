import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("min", () => {
  const numbers = [2, 1, 3, 5, 4];
  test("empty", () => {
    expect(
      chainable
        .from<number>()
        .max((v) => v)
        .toSingle(-1),
    ).toBe(-1);
  });

  test("by value", () => {
    expect(
      chainable
        .from<number>(numbers)
        .min((v) => v)
        .toSingle(),
    ).toBe(1);
  });

  test("by module 4", () => {
    expect(
      chainable
        .from<number>(numbers)
        .min((v) => v % 4)
        .toSingle(),
    ).toBe(4);
  });
});
