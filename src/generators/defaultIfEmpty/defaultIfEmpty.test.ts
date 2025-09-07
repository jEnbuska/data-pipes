import { describe, test, expect } from "bun:test";
import { chainable, filter, defaultIfEmpty } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("defaultIfEmpty", () => {
  test("default with empty", () => {
    expect(chainable([]).defaultIfEmpty(0).first()).toBe(0);
  });
  test("default no empty", () => {
    expect(chainable(1).defaultIfEmpty(0).first()).toBe(1);
  });

  test("pipe - defaultIfEmpty", () => {
    const value = pipe(
      [1, 2, 3],
      filter((it) => it > 3),
      defaultIfEmpty(0),
    ).first();
    expect(value).toBe(0);
  });
});
