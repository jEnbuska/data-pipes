import { expect, test, describe } from "vitest";
import yielded from "../src/index.ts";

describe("providers", () => {
  const numbers = [1, 2, 3];
  function* generatorFunction() {
    yield* numbers;
  }
  test("single", () => {
    const first = yielded(numbers[0]).resolve();
    expect(first).toStrictEqual(numbers[0]);
  });

  test("array", () => {
    expect(yielded(numbers).resolve()).toStrictEqual([1, 2, 3]);
  });

  test("generator function", () => {
    expect(
      yielded(generatorFunction).resolve() satisfies number[],
    ).toStrictEqual(numbers);
  });

  test("generator", () => {
    expect(
      yielded(generatorFunction()).resolve() satisfies number[],
    ).toStrictEqual(numbers);
  });
});
