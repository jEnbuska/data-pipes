import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("max", () => {
  const numbers = [1, 2, 3, 5, 4];
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
        .max((v) => v)
        .toSingle(),
    ).toBe(5);
  });

  test("by module 4", () => {
    expect(
      chainable
        .from<number>(numbers)
        .max((v) => v % 4)
        .toSingle(),
    ).toBe(3);
  });
});
