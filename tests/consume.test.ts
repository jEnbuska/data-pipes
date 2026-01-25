import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";

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
      .awaited()
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async to consume", async () => {
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
