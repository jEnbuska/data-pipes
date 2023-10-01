import { expect, test, describe } from "bun:test";
import { chainable } from "../..";
import { toConsumer } from "./toConsumer";

describe("toConsumer", () => {
  const numbers = [1, 2, 3];
  test("consume", () => {
    const consumed: number[] = [];
    function* source() {
      yield consumed.push(1);
      yield consumed.push(2);
      yield consumed.push(3);
    }
    toConsumer()(source());
    expect(consumed).toStrictEqual(numbers);
  });

  test("pipe to consumer", () => {
    const consumed: number[] = [];
    chainable(function* source() {
      yield consumed.push(1);
      yield consumed.push(2);
      yield consumed.push(3);
    }).consume();
    expect(consumed).toStrictEqual(numbers);
  });
});
