import { describe, test, expect } from "bun:test";
import { chain, reduce } from "../index.ts";
import { pipe } from "../pipe.ts";

describe("reduce", () => {
  test("sum chainable", () => {
    const sum = chain([1, 2, 3])
      .reduce((acc, v) => acc + v, 0)
      .first();
    expect(sum).toBe(6);
  });

  test("sum pipe", () => {
    const sum = pipe(
      [1, 2, 3],
      reduce((acc, v) => acc + v, 0),
    ).first();
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = chain<number>([])
      .reduce((acc, v) => acc + v, 0)
      .first();
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = chain([1, 2, 3])
      .reduce((acc, v) => [...acc, v], [] as number[])
      .first();
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
