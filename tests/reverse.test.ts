import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = yielded([1, 2, 3]).reversed().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
