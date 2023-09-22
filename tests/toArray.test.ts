import { expect, test, describe } from "bun:test";
import { toArray } from "../src/consumers/toArray.ts";
import pipe from "../src/pipe.ts";

describe("toArray", () => {
  const numbers = [1, 2, 3];
  test("single to array", () => {
    expect(
      toArray(function* () {
        yield numbers[0];
      }),
    ).toStrictEqual([numbers[0]]);
  });

  test("delegated iterable multiple to array", () => {
    expect(
      toArray(function* () {
        yield* numbers;
      }),
    ).toStrictEqual(numbers);
  });

  test("iterable multiple to array", () => {
    expect(
      toArray(function* () {
        for (const number of numbers) {
          yield number;
        }
      }),
    ).toStrictEqual(numbers);
  });

  test("pipe single to array", () => {
    expect(pipe(1).toArray()).toStrictEqual([1]);
  });

  test("pipe generator array", () => {
    expect(
      pipe(function* () {
        yield* [1, 2, 3];
      }).toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("pipe array to array", () => {
    expect(pipe(numbers).toArray()).toStrictEqual(numbers);
  });
});
