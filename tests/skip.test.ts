import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(yielded([1, 2, 3]).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(yielded([1, 2, 3]).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(yielded([1, 2, 3]).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(yielded([1, 2, 3]).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
