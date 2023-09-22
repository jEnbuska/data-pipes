import { describe, test, expect } from "bun:test";
import pipe from "../src/pipe.ts";

describe("takeWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("takeWhile negative", () => {
    expect(
      pipe(numbers)
        .takeWhile((n) => n < 0)
        .toArray(),
    ).toStrictEqual([-2, -1]);
  });

  test("takeWhile always", () => {
    expect(
      pipe(numbers)
        .takeWhile(() => true)
        .toArray(),
    ).toStrictEqual(numbers);
  });

  test("takeWhile never", () => {
    expect(
      pipe(numbers)
        .takeWhile(() => false)
        .toArray(),
    ).toStrictEqual([]);
  });
});
