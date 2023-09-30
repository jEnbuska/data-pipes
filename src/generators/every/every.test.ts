import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("every", () => {
  test("has every", () => {
    expect(chainable.from(true, true, true).every(Boolean).toSingle()).toBe(
      true,
    );
  });
  test("has none", () => {
    expect(chainable.from(false, false, false).every(Boolean).toSingle()).toBe(
      false,
    );
  });

  test("has some", () => {
    expect(chainable.from(false, false, false).every(Boolean).toSingle()).toBe(
      false,
    );
  });
});
