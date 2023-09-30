import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("defaultIfEmpty", () => {
  test("default with empty", () => {
    expect(chainable.from().defaultIfEmpty(0).toSingle()).toBe(0);
  });
  test("default no empty", () => {
    expect(chainable.from(1).defaultIfEmpty(0).toSingle()).toBe(1);
  });
});
