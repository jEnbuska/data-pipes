import { expect, test, describe } from "bun:test";
import streamless from "../";

describe("chainable", () => {
  const numbers = [1, 2, 3];
  function* generatorFunction() {
    yield* numbers;
  }
  test("single", () => {
    const array = streamless(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("array", () => {
    expect(streamless(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("generator function", () => {
    expect(
      streamless(generatorFunction).toArray() satisfies number[],
    ).toStrictEqual(numbers);
  });

  test("generator", () => {
    expect(
      streamless(generatorFunction()).toArray() satisfies number[],
    ).toStrictEqual(numbers);
  });
});
