import { expect, test, describe } from "bun:test";
import { chainable } from "./chainable.ts";
import { map } from "../generators";
import { pipe } from "../pipe/pipe.ts";

describe("chainable", () => {
  const numbers = [1, 2, 3];
  function* generator() {
    yield* numbers;
  }
  test("single", () => {
    const array = chainable(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("array", () => {
    expect(chainable(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("generator", () => {
    expect(chainable(generator).toArray()).toStrictEqual(numbers);
  });

  test("chainable as source", () => {
    const max = chainable(chainable([1, 2, 3]).map((n) => n * 2))
      .reduce((max, next) => (max < next ? next : max), 0)
      .toArray();
    expect(max).toStrictEqual([6]);
  });

  test("pipe as source", () => {
    const max = chainable(
      pipe(
        [1, 2, 3],
        map((n) => n * 2),
      ),
    )
      .reduce((max, next) => (max < next ? next : max), 0)
      .toArray();
    expect(max).toStrictEqual([6]);
  });
});
