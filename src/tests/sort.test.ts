import { describe, test, expect } from "bun:test";
import streamless from "../";
import { sleep } from "bun";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      streamless([3, 1, 2])
        .sort((a, z) => a - z)
        .collect(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort empty", () => {
    expect(
      streamless<number>([])
        .sort((a, z) => a - z)
        .collect(),
    ).toStrictEqual([]);
  });
  test("sort resolver", async () => {
    expect(
      await (streamless<number>([2, 1, 3])
        .map((value) => Promise.resolve(value))
        .resolve()
        .sort((a, z) => a - z)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort resolver parallel partial", async () => {
    expect(
      await (streamless<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .resolveParallel(3)
        .sort((a, z) => a - z)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });

  test("sort resolver parallel all", async () => {
    expect(
      await (streamless<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .resolveParallel(10)
        .sort((a, z) => a - z)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });
});
