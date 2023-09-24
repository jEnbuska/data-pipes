import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("unflat", () => {
  test("numbers", () => {
    const numbers = [1, 2, 3];
    const array = pipe(numbers).unflat().toSingle();
    expect(array).toStrictEqual(numbers);
  });
});
