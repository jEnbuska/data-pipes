import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("reverse", () => {
  test("numbers", () => {
    const array = pipe(1, 2, 3).reverse().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
