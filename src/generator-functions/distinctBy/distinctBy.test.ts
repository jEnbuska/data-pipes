import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("distinctBy", () => {
  test("empty", () => {
    expect(
      pipe()
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      pipe(1, 2, 3)
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("by module 2", () => {
    expect(
      pipe(1, 2, 3, 4)
        .distinctBy((it) => it % 2)
        .toArray(),
    ).toStrictEqual([1, 2]);
  });
});
