import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("find", () => {
  test("find first", () => {
    expect(
      pipe(1, 2, 3)
        .find((it) => it === 1)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("find second", () => {
    expect(
      pipe(1, 2, 3)
        .find((it) => it === 2)
        .toArray(),
    ).toStrictEqual([2]);
  });

  test("find last", () => {
    expect(
      pipe(1, 2, 3)
        .find((it) => it === 3)
        .toArray(),
    ).toStrictEqual([3]);
  });

  test("find none", () => {
    expect(
      pipe(1, 2, 3)
        .find((it) => it === 4)
        .toArray(),
    ).toStrictEqual([]);
  });
});
