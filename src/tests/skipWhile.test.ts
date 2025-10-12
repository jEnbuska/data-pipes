import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = source(numbers)
      .skipWhile((n) => n < 0)
      .toArray();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = source(numbers)
      .skipWhile(() => true)
      .toArray();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = source(numbers)
      .skipWhile(() => false)
      .toArray();
    expect(array).toStrictEqual(numbers);
  });
});
