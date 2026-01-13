import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = streamless(numbers)
      .skipWhile((n) => n < 0)
      .collect();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = streamless(numbers)
      .skipWhile(() => true)
      .collect();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = streamless(numbers)
      .skipWhile(() => false)
      .collect();
    expect(array).toStrictEqual(numbers);
  });
});
