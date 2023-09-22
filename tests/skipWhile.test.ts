import { describe, test, expect } from "bun:test";
import pipe from "../src/pipe.ts";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    expect(
      pipe(numbers)
        .skipWhile((n) => n < 0)
        .toArray(),
    ).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    expect(
      pipe(numbers)
        .skipWhile(() => true)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    expect(
      pipe(numbers)
        .skipWhile(() => false)
        .toArray(),
    ).toStrictEqual(numbers);
  });
});
