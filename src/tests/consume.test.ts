import { expect, test, describe } from "bun:test";
import { streamless } from "../";

describe("consume", () => {
  const numbers = [1, 2, 3];

  test("chainable to consume", () => {
    const consumed: number[] = [];
    streamless(numbers)
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await streamless(numbers)
      .map((value) => Promise.resolve(value))
      .resolve()
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async resolver to consume", async () => {
    const consumed: number[] = [];
    await streamless(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
