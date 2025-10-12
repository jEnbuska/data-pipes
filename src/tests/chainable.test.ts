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
});
