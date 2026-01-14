import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = yielded(numbers)
      .skipWhile((n) => n < 0)
      .collect();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = yielded(numbers)
      .skipWhile(() => true)
      .collect();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = yielded(numbers)
      .skipWhile(() => false)
      .collect();
    expect(array).toStrictEqual(numbers);
  });
});
