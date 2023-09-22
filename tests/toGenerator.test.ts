import { expect, test, describe } from "bun:test";
import { toGenerator } from "../src/consumers/toGenerator.ts";
import pipe from "../src/pipe.ts";

describe("toGenerator", () => {
  const numbers = [1, 2, 3];
  function* numberGeneratorFunction() {
    yield 1;
    yield* [2, 3];
  }
  test("generator function to generator", () => {
    const generator = toGenerator(numberGeneratorFunction);
    numbers.forEach((value) => expect(generator.next().value).toBe(value));
    expect(generator.next().done).toBe(true);
  });

  test("pipe generator function to generator", () => {
    const generator = pipe(numberGeneratorFunction).toGenerator();
    numbers.forEach((value) => expect(generator.next().value).toBe(value));
    expect(generator.next().done).toBe(true);
  });
});
