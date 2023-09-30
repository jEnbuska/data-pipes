import { describe, expect, test } from "bun:test";
import { chainable } from "../..";

describe("count", () => {
  test("count single", () => {
    expect(chainable.from(0).count().toSingle()).toBe(1);
  });
  test("count multiple", () => {
    expect(chainable.from(0, 1, 2, [3, 4]).count().toSingle()).toBe(5);
  });
  test("count none", () => {
    expect(chainable.from().count().toSingle()).toBe(0);
  });
});
