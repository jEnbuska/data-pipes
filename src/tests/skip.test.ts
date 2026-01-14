import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(yielded([1, 2, 3]).skip(1).collect()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(yielded([1, 2, 3]).skip(5).collect()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(yielded([1, 2, 3]).skip(0).collect()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(yielded([1, 2, 3]).skip(-1).collect()).toStrictEqual([1, 2, 3]);
  });
});
