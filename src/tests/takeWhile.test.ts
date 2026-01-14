import { describe, test, expect, mock } from "bun:test";
import yielded from "../";

describe("takeWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("takeWhile negative", () => {
    const callback = mock(() => {});
    const result = yielded(numbers)
      .tap(callback)
      .takeWhile((n) => n < 0)
      .collect();
    expect(result).toStrictEqual([-2, -1]);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("takeWhile always", () => {
    const callback = mock(() => {});
    const result = yielded(numbers)
      .tap(callback)
      .takeWhile(() => true)
      .collect();
    expect(result).toStrictEqual(numbers);
    expect(callback).toHaveBeenCalledTimes(numbers.length);
  });

  test("takeWhile never", () => {
    const callback = mock(() => {});
    const array = yielded(numbers)
      .tap(callback)
      .takeWhile(() => false)
      .collect();
    expect(array).toStrictEqual([]);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
