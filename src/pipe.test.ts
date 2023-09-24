import { expect, test, describe } from "bun:test";
import pipe from ".";

describe("pipe input", () => {
  const numbers = [1, 2, 3];
  function* generator() {
    yield* numbers;
  }
  test("single", () => {
    const array = pipe(numbers[0]).toArray();
    expect(array).toStrictEqual([numbers[0]]);
  });

  test("multiple singles", () => {
    expect(pipe(...numbers).toArray()).toStrictEqual(numbers);
  });

  test("array", () => {
    expect(pipe(numbers).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("multiple arrays", () => {
    expect(pipe(numbers, numbers).toArray()).toStrictEqual([
      ...numbers,
      ...numbers,
    ]);
  });
  test("generator", () => {
    expect(pipe(generator).toArray()).toStrictEqual(numbers);
  });

  test("multiple generators", () => {
    expect(pipe(generator, generator).toArray()).toStrictEqual([
      ...numbers,
      ...numbers,
    ]);
  });

  test("mixed", () => {
    expect(pipe(...numbers, numbers, generator).toArray()).toStrictEqual([
      ...numbers,
      ...numbers,
      ...numbers,
    ]);
  });
});
