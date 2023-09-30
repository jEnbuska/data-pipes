import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("unflat", () => {
  test("numbers", () => {
    const numbers = [1, 2, 3];
    const array = chainable.from(numbers).unflat().toSingle();
    expect(array).toStrictEqual(numbers);
  });
});
