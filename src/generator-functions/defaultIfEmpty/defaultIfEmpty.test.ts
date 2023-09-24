import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("defaultIfEmpty", () => {
  test("default with empty", () => {
    expect(pipe().defaultIfEmpty(0).toSingle()).toBe(0);
  });
  test("default no empty", () => {
    expect(pipe(1).defaultIfEmpty(0).toSingle()).toBe(1);
  });
});
