import { describe, test, expect } from "vitest";
import yielded from "../src/index.ts";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(yielded([1, 2, 3]).skip(1).resolve()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(yielded([1, 2, 3]).skip(5).resolve()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(yielded([1, 2, 3]).skip(0).resolve()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(yielded([1, 2, 3]).skip(-1).resolve()).toStrictEqual([1, 2, 3]);
  });
});
