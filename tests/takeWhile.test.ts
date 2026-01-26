import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { simpleMock } from "./utils/simpleMock.ts";

describe("takeWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("takeWhile negative", () => {
    const callback = simpleMock(numbers);
    const result = Yielded.from(numbers)
      .tap(callback)
      .takeWhile((n) => n < 0)
      .toArray();
    expect(result).toStrictEqual([-2, -1]);
    expect(callback.getCalled()).toBe(3);
  });

  test("takeWhile always", () => {
    const callback = simpleMock(numbers);
    const result = Yielded.from(numbers)
      .tap((n: number) => callback(n))
      .takeWhile(() => true)
      .toArray();
    expect(result).toStrictEqual(numbers);
    expect(callback.getCalled()).toBe(numbers.length);
  });

  test("takeWhile never", () => {
    const callback = simpleMock(numbers);
    const array = Yielded.from(numbers)
      .tap(callback)
      .takeWhile(() => false)
      .toArray();
    expect(array).toStrictEqual([]);
    expect(callback.getCalled()).toBe(1);
  });
});
