import { expect, test, describe } from "bun:test";
import streamless from "../";

describe("sources", () => {
  const numbers = [1, 2, 3];
  function* generatorFunction() {
    yield* numbers;
  }
  test("single", () => {
    const first = streamless(numbers[0]).collect();
    expect(first).toStrictEqual(numbers[0]);
  });

  test("array", () => {
    expect(streamless(numbers).collect()).toStrictEqual([1, 2, 3]);
  });

  test("generator function", () => {
    expect(
      streamless(generatorFunction).collect() satisfies number[],
    ).toStrictEqual(numbers);
  });

  test("generator", () => {
    expect(
      streamless(generatorFunction()).collect() satisfies number[],
    ).toStrictEqual(numbers);
  });
});
