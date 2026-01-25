import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("reduce", () => {
  test("sum chainable", () => {
    const sum = Yielded.from([1, 2, 3]).reduce((acc, v) => acc + v, 0);
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = Yielded.from<number>([]).reduce((acc, v) => acc + v, 0);
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = Yielded.from([1, 2, 3]).reduce(
      (acc, v) => [...acc, v],
      [] as number[],
    );
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
