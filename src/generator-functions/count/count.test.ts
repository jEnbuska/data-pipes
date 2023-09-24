import { describe, expect, test } from "bun:test";
import pipe from "../..";

describe("count", () => {
  test("count single", () => {
    expect(pipe(0).count().toSingle()).toBe(1);
  });
  test("count multiple", () => {
    expect(pipe(0, 1, 2, [3, 4]).count().toSingle()).toBe(5);
  });
  test("count none", () => {
    expect(pipe().count().toSingle()).toBe(0);
  });
});
