import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = Yielded.from([1, 2, 3]).reversed().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
