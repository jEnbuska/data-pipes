import { describe, test, expect } from "bun:test";
import yielded from "../index";

describe("reduce", () => {
  test("sum chainable", () => {
    const sum = yielded([1, 2, 3])
      .reduce((acc, v) => acc + v, 0)
      .collect();
    expect(sum).toBe(6);
  });

  test("empty sum", () => {
    const sum = yielded<number>([])
      .reduce((acc, v) => acc + v, 0)
      .collect();
    expect(sum).toBe(0);
  });

  test("to array", () => {
    const array = yielded([1, 2, 3])
      .reduce((acc, v) => [...acc, v], [] as number[])
      .collect();
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
