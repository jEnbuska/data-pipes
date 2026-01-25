import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";
import { sleep } from "./utils/sleep.ts";

describe("sorted", () => {
  test("sort numbers", () => {
    expect(
      yielded([3, 1, 2])
        .sorted((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort empty", () => {
    expect(
      yielded<number>([])
        .sorted((a, z) => a - z)
        .resolve(),
    ).toStrictEqual([]);
  });
  test("sort resolver", async () => {
    expect(
      await (yielded<number>([2, 1, 3])
        .map((value) => Promise.resolve(value))
        .awaited()
        .sorted((a, z) => a - z)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort resolver parallel partial", async () => {
    expect(
      await (yielded<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .awaited()
        .parallel(3)
        .sorted((a, z) => a - z)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });

  test("sort resolver parallel all", async () => {
    expect(
      await (yielded<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .awaited()
        .parallel(10)
        .sorted((a, z) => a - z)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });
});
