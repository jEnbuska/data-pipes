import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("some", () => {
  test("has some", () => {
    expect(pipe(false, true, false).some(Boolean).toSingle()).toBe(true);
  });

  test("has none", () => {
    expect(pipe(false, false, false).some(Boolean).toSingle()).toBe(false);
  });

  test("has every", () => {
    expect(pipe(true, true, true).some(Boolean).toSingle()).toBe(true);
  });
});
