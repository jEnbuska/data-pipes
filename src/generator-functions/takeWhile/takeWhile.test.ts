import { describe, test, expect, mock } from "bun:test";
import pipe from "../../index.ts";

describe("takeWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("takeWhile negative", () => {
    const callback = mock(() => {});
    const result = pipe(numbers)
      .forEach(callback)
      .takeWhile((n) => n < 0)
      .toArray();
    expect(result).toStrictEqual([-2, -1]);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("takeWhile always", () => {
    const callback = mock(() => {});
    const result = pipe(numbers)
      .forEach(callback)
      .takeWhile(() => true)
      .toArray();
    expect(result).toStrictEqual(numbers);
    expect(callback).toHaveBeenCalledTimes(numbers.length);
  });

  test("takeWhile never", () => {
    const callback = mock(() => {});
    const array = pipe(numbers)
      .forEach(callback)
      .takeWhile(() => false)
      .toArray();
    expect(array).toStrictEqual([]);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
