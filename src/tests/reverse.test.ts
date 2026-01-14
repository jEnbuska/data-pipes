import { describe, test, expect } from "vitest";
import yielded from "../index.ts";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = yielded([1, 2, 3]).toReverse().resolve();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
