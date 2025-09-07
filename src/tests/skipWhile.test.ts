import { describe, test, expect } from "bun:test";
import { chain } from "../index.ts";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = chain(numbers)
      .skipWhile((n) => n < 0)
      .toArray();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = chain(numbers)
      .skipWhile(() => true)
      .toArray();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = chain(numbers)
      .skipWhile(() => false)
      .toArray();
    expect(array).toStrictEqual(numbers);
  });
});
