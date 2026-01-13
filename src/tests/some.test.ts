import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("some", () => {
  test("has some", () => {
    expect(streamless([false, true, false]).some(Boolean).collect()).toBe(true);
  });

  test("has none", () => {
    expect(streamless([false, false, false]).some(Boolean).collect()).toBe(
      false,
    );
  });

  test("has every", () => {
    expect(streamless([true, true, true]).some(Boolean).collect()).toBe(true);
  });
});
