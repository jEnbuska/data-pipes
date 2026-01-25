import { describe, expect, test } from "vitest";
import { AsyncYielded, Yielded } from "../src/index.ts";

describe("consume", () => {
  const numbers = [1, 2, 3];

  test("chainable to consume", () => {
    const consumed: number[] = [];
    Yielded.from(numbers)
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await Yielded.from(numbers)
      .map((value) => Promise.resolve(value))
      .awaited()
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async to consume", async () => {
    const consumed: number[] = [];
    await AsyncYielded.from(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .tap((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
