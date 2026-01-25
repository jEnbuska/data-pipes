import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("providers", () => {
  const numbers = [1, 2, 3];
  function* generatorFunction() {
    yield* numbers;
  }
  test("single", () => {
    const first = Yielded.from(numbers[0]).first();
    expect(first).toStrictEqual(numbers[0]);
  });

  test("array", () => {
    expect(Yielded.from(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("generator function", () => {
    expect(
      Yielded.from(generatorFunction).toArray() satisfies number[],
    ).toStrictEqual(numbers);
  });

  test("generator", () => {
    expect(
      Yielded.from(generatorFunction()).toArray() satisfies number[],
    ).toStrictEqual(numbers);
  });
});
