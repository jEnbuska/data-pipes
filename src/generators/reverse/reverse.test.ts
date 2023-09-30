import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("reverse", () => {
  test("numbers", () => {
    const array = chainable.from(1, 2, 3).reverse().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
