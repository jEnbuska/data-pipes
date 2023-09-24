import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("reduce", () => {
  test("sum", () => {
    const sum = pipe(1, 2, 3)
      .reduce((acc, v) => acc + v, 0)
      .toSingle();
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = pipe<number>()
      .reduce((acc, v) => acc + v, 0)
      .toSingle();
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = pipe(1, 2, 3)
      .reduce((acc, v) => [...acc, v], [] as number[])
      .toSingle();
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
