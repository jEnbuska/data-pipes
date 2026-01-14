import { describe, test, expect } from "vitest";
import yielded from "../src/index.ts";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = yielded(numbers)
      .skipWhile((n) => n < 0)
      .resolve();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = yielded(numbers)
      .skipWhile(() => true)
      .resolve();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = yielded(numbers)
      .skipWhile(() => false)
      .resolve();
    expect(array).toStrictEqual(numbers);
  });
});
