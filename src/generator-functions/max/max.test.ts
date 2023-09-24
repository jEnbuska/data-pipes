import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("max", () => {
  const numbers = [1, 2, 3, 5, 4];
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
        .max((v) => v)
        .toSingle(),
    ).toBe(5);
  });

  test("by module 4", () => {
    expect(
      pipe<number>(numbers)
        .max((v) => v % 4)
        .toSingle(),
    ).toBe(3);
  });
});
