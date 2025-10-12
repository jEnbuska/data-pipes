import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(source([1, 2, 3]).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(source([1, 2, 3]).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(source([1, 2, 3]).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(source([1, 2, 3]).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
