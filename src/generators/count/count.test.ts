import { describe, expect, test } from "bun:test";
import { chainable } from "../..";

describe("count", () => {
  test("count single", () => {
    expect(chainable(0).count().first()).toBe(1);
  });
  test("count multiple", () => {
    expect(chainable(0, 1, 2, [3, 4]).count().first()).toBe(5);
  });
  test("count none", () => {
    expect(chainable().count().first()).toBe(0);
  });
});
