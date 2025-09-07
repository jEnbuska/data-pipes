import { describe, test, expect } from "bun:test";
import { chain, reverse } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";

describe("reverse", () => {
  test("chainable - numbers", () => {
    const array = chain([1, 2, 3]).reverse().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });

  test("pipe - numbers", () => {
    const array = pipe([1, 2, 3], reverse()).toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });
});
