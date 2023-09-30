import { expect, test, describe } from "bun:test";
import { chainable } from ".";

describe("chainable from", () => {
  const numbers = [1, 2, 3];
  function* generator() {
    yield* numbers;
  }
  test("single", () => {
    const array = chainable.from(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("multiple singles", () => {
    expect(chainable.from(...numbers).toArray()).toStrictEqual(numbers);
  });

  test("array", () => {
    expect(chainable.from(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("multiple arrays", () => {
    expect(chainable.from(numbers, numbers).toArray()).toStrictEqual([
      ...numbers,
      ...numbers,
    ]);
  });
  test("generator", () => {
    expect(chainable.from(generator).toArray()).toStrictEqual(numbers);
  });

  test("multiple generators", () => {
    expect(chainable.from(generator, generator).toArray()).toStrictEqual([
      ...numbers,
      ...numbers,
    ]);
  });

  test("mixed", () => {
    expect(
      chainable.from(...numbers, numbers, generator).toArray(),
    ).toStrictEqual([...numbers, ...numbers, ...numbers]);
  });
});
