import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("skipWhile", () => {
  const numbers = [-2, -1, 0, 1, 2];
  test("skipWhile negative", () => {
    const array = streamless(numbers)
      .skipWhile((n) => n < 0)
      .toArray();
    expect(array).toStrictEqual([0, 1, 2]);
  });

  test("skipWhile always", () => {
    const array = streamless(numbers)
      .skipWhile(() => true)
      .toArray();
    expect(array).toStrictEqual([]);
  });

  test("skipWhile never", () => {
    const array = streamless(numbers)
      .skipWhile(() => false)
      .toArray();
    expect(array).toStrictEqual(numbers);
  });
});
