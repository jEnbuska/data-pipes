import { expect, test, describe } from "bun:test";
import source from "../index.ts";

describe("consume", () => {
  const numbers = [1, 2, 3];

  test("chainable to consume", () => {
    const consumed: number[] = [];
    source(numbers)
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await source(numbers)
      .map((value) => Promise.resolve(value))
      .resolve()
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async resolver to consume", async () => {
    const consumed: number[] = [];
    await source(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
