import { expect, test, describe } from "bun:test";
import { chainable } from "../..";
import { consume } from "./consume.ts";

describe("consume", () => {
  const numbers = [1, 2, 3];
  test("consume", () => {
    const consumed: number[] = [];
    function* source() {
      yield consumed.push(1);
      yield consumed.push(2);
      yield consumed.push(3);
    }
    consume()(source());
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable to consume", () => {
    const consumed: number[] = [];
    chainable(numbers)
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await chainable(numbers)
      .map((value) => Promise.resolve(value))
      .resolve()
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async resolver to consume", async () => {
    const consumed: number[] = [];
    await chainable(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
