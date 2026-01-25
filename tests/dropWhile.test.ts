import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("dropWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("dropWhile negative", () => {
    const array = Yielded.from(numbers)
      .dropWhile((n) => n < 0)
      .toArray();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("dropWhile always", () => {
    const array = Yielded.from(numbers)
      .dropWhile(() => true)
      .toArray();
    expect(array).toStrictEqual([]);
  });

  test("dropWhile never", () => {
    const array = Yielded.from(numbers)
      .dropWhile(() => false)
      .toArray();
    expect(array).toStrictEqual(numbers);
  });
});
