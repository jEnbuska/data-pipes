import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("filter", () => {
  test("filter evens", () => {
    expect(
      pipe(1, 2, 3, 4)
        .filter((n) => n % 2 === 0)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });
});
