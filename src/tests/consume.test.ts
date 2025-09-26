import { expect, test, describe } from "bun:test";
import { chain } from "../index.ts";
import { consume } from "../consumers/consume.ts";

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
    chain(numbers)
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable promises to consume", async () => {
    const consumed: number[] = [];
    await chain(numbers)
      .map((value) => Promise.resolve(value))
      .resolve()
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });

  test("chainable async resolver to consume", async () => {
    const consumed: number[] = [];
    await chain(async function* () {
      for (const value of numbers) {
        yield value;
      }
    })
      .forEach((value) => consumed.push(value satisfies number))
      .consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
