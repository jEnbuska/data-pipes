import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("some", () => {
  test("has some", () => {
    expect(chainable.from(false, true, false).some(Boolean).toSingle()).toBe(
      true,
    );
  });

  test("has none", () => {
    expect(chainable.from(false, false, false).some(Boolean).toSingle()).toBe(
      false,
    );
  });

  test("has every", () => {
    expect(chainable.from(true, true, true).some(Boolean).toSingle()).toBe(
      true,
    );
  });
});
