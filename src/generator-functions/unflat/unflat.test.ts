import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("unflat", () => {
  test("numbers", () => {
    const numbers = [1, 2, 3];
    const array = pipe(numbers).unflat().toSingle();
    expect(array).toStrictEqual(numbers);
  });
});
