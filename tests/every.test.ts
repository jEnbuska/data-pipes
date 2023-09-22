import { describe, test, expect } from "bun:test";
import pipe from "../src/pipe.ts";

describe("every", () => {
  test("has every", () => {
    expect(pipe(true, true, true).every(Boolean).toSingle()).toBe(true);
  });
  test("has none", () => {
    expect(pipe(false, false, false).every(Boolean).toSingle()).toBe(false);
  });

  test("has some", () => {
    expect(pipe(false, false, false).every(Boolean).toSingle()).toBe(false);
  });
});
