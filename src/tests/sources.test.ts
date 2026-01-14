import { expect, test, describe } from "bun:test";
import yielded from "../";

describe("sources", () => {
  const numbers = [1, 2, 3];
  function* generatorFunction() {
    yield* numbers;
  }
  test("single", () => {
    const first = yielded(numbers[0]).collect();
    expect(first).toStrictEqual(numbers[0]);
  });

  test("array", () => {
    expect(yielded(numbers).collect()).toStrictEqual([1, 2, 3]);
  });

  test("generator function", () => {
    expect(
      yielded(generatorFunction).collect() satisfies number[],
    ).toStrictEqual(numbers);
  });

  test("generator", () => {
    expect(
      yielded(generatorFunction()).collect() satisfies number[],
    ).toStrictEqual(numbers);
  });
});
