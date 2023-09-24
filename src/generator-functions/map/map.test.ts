import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("map", () => {
  test("multiply", () => {
    expect(
      pipe(1, 2)
        .map((n) => n * 2)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });
});
