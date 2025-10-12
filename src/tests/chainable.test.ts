import { expect, test, describe } from "bun:test";
import source from "../index";

describe("chainable", () => {
  const numbers = [1, 2, 3];
  function* generator() {
    yield* numbers;
  }
  test("single", () => {
    const array = source(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("array", () => {
    expect(source(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("generator", () => {
    expect(source(generator).toArray()).toStrictEqual(numbers);
  });

  test("chainable as source", () => {
    const max = source(source([1, 2, 3]).map((n) => n * 2))
      .reduce((max, next) => (max < next ? next : max), 0)
      .toArray();
    expect(max).toStrictEqual([6]);
  });

  test("iteration", () => {
    const values = source(function* () {
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
    const values = source(async function* () {
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
