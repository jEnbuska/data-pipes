import { describe, test, expect } from "vitest";
import yielded from "../src/index.ts";
import { simpleMock } from "./utils/simpleMock.ts";

describe("takeWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("takeWhile negative", () => {
    const callback = simpleMock(numbers);
    const result = yielded(numbers)
      .tap((n: number) => callback(n))
      .takeWhile((n) => n < 0)
      .resolve();
    expect(result).toStrictEqual([-2, -1]);
    expect(callback.called).toBe(3);
  });

  test("takeWhile always", () => {
    const callback = simpleMock(numbers);
    const result = yielded(numbers)
      .tap((n: number) => callback(n))
      .takeWhile(() => true)
      .resolve();
    expect(result).toStrictEqual(numbers);
    expect(callback.called).toBe(numbers.length);
  });

  test("takeWhile never", () => {
    const callback = simpleMock(numbers);
    const array = yielded(numbers)
      .tap(callback)
      .takeWhile(() => false)
      .resolve();
    expect(array).toStrictEqual([]);
    expect(callback.called).toBe(1);
  });
});
