import { expect, test, describe } from "bun:test";
import { toArray } from "./toArray.ts";
import pipe from "../../index.ts";

describe("toArray", () => {
  const numbers = [1, 2, 3];
  test("single to array", () => {
    function* source() {
      yield numbers[0];
    }
    expect(toArray(source())).toStrictEqual([numbers[0]]);
  });

  test("delegated iterable multiple to array", () => {
    function* source() {
      yield* numbers;
    }
    expect(toArray(source())).toStrictEqual(numbers);
  });

  test("iterable multiple to array", () => {
    function* source() {
      for (const number of numbers) {
        yield number;
      }
    }
    expect(toArray(source())).toStrictEqual(numbers);
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
