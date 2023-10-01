import { describe, test, expect } from "bun:test";
import { chainable, skip } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(chainable(1, 2, 3).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("pipe skip 1", () => {
    expect(pipe([1, 2, 3], skip(1)).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(chainable(1, 2, 3).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(chainable(1, 2, 3).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(chainable(1, 2, 3).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
