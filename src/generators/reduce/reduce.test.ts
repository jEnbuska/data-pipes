import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("reduce", () => {
  test("sum", () => {
    const sum = chainable
      .from(1, 2, 3)
      .reduce((acc, v) => acc + v, 0)
      .toSingle();
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = chainable
      .from<number>()
      .reduce((acc, v) => acc + v, 0)
      .toSingle();
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = chainable
      .from(1, 2, 3)
      .reduce((acc, v) => [...acc, v], [] as number[])
      .toSingle();
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
