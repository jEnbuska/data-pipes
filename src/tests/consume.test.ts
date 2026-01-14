import { expect, test, describe } from "bun:test";
import yielded from "../";

describe("consume", () => {
  const numbers = [1, 2, 3];

  test("chainable to consume", () => {
    const consumed: number[] = [];
    yielded(numbers)
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await yielded(numbers)
      .map((value) => Promise.resolve(value))
      .resolve()
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async resolver to consume", async () => {
    const consumed: number[] = [];
    await yielded(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
