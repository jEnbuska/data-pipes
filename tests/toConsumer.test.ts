import { expect, test, describe } from "bun:test";
import { toArray } from "../src/consumers/toArray.ts";
import pipe from "../src/pipe.ts";
import { toConsumer } from "../src/consumers/toConsumer.ts";

describe("toConsumer", () => {
  const numbers = [1, 2, 3];
  test("consume", () => {
    const consumed: number[] = [];
    toConsumer(function* () {
      yield consumed.push(1);
      yield consumed.push(2);
      yield consumed.push(3);
    });
    expect(consumed).toStrictEqual(numbers);
  });

  test("pipe to consumer", () => {
    const consumed: number[] = [];
    pipe(function* () {
      yield consumed.push(1);
      yield consumed.push(2);
      yield consumed.push(3);
    }).toConsumer();
    expect(consumed).toStrictEqual(numbers);
  });
});
