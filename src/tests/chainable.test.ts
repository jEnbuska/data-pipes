import { expect, test, describe } from "bun:test";
import { chain } from "../chainable/chain.ts";
import { map } from "../generators";
import { pipe } from "../pipe/pipe.ts";

describe("chainable", () => {
  const numbers = [1, 2, 3];
  function* generator() {
    yield* numbers;
  }
  test("single", () => {
    const array = chain(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("array", () => {
    expect(chain(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("generator", () => {
    expect(chain(generator).toArray()).toStrictEqual(numbers);
  });

  test("chainable as source", () => {
    const max = chain(chain([1, 2, 3]).map((n) => n * 2))
      .reduce((max, next) => (max < next ? next : max), 0)
      .toArray();
    expect(max).toStrictEqual([6]);
  });

  test("pipe as source", () => {
    const max = chain(
      pipe(
        [1, 2, 3],
        map((n) => n * 2),
      ),
    )
      .reduce((max, next) => (max < next ? next : max), 0)
      .toArray();
    expect(max).toStrictEqual([6]);
  });

  test("iteration", () => {
    const values = chain(function* () {
      yield 1;
      yield 2;
    });
    let count = 0;
    for (const value of values) {
      expect(value satisfies number).toBe(++count);
    }
    expect(count).toBe(2);
  });

  test("async iteration", async () => {
    const values = chain(async function* () {
      yield 1;
      yield 2;
    });
    let count = 0;
    for await (const value of values) {
      expect(value satisfies number).toBe(++count);
    }
    expect(count).toBe(2);
  });
});
