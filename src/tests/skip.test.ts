import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(streamless([1, 2, 3]).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(streamless([1, 2, 3]).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(streamless([1, 2, 3]).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(streamless([1, 2, 3]).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
