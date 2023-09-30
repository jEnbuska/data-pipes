import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("map", () => {
  test("multiply", () => {
    expect(
      chainable
        .from(1, 2)
        .map((n) => n * 2)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });
});
