import { describe, expect, test } from "bun:test";
import { chainable } from "../..";

describe("count", () => {
  test("count single", () => {
    expect(chainable(0).count().first()).toBe(1);
  });
  test("count none", () => {
    expect(chainable().count().first()).toBe(0);
  });
});
