import { describe, test, expect } from "bun:test";
import { streamless } from "../index.ts";

describe("reduce", () => {
  test("sum chainable", () => {
    const sum = streamless([1, 2, 3])
      .reduce((acc, v) => acc + v, 0)
      .first();
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = streamless<number>([])
      .reduce((acc, v) => acc + v, 0)
      .first();
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = streamless([1, 2, 3])
      .reduce((acc, v) => [...acc, v], [] as number[])
      .first();
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
