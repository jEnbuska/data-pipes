import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { sleep } from "./utils/sleep.ts";

describe("sorted", () => {
  test("sort numbers", () => {
    expect(Yielded.from([3, 1, 2]).toSorted((a, z) => a - z)).toStrictEqual([
      1, 2, 3,
    ]);
  });

  test("sort empty", () => {
    expect(Yielded.from<number>([]).toSorted((a, z) => a - z)).toStrictEqual(
      [],
    );
  });
  test("sort resolver", async () => {
    expect(
      await (Yielded.from<number>([2, 1, 3])
        .map((value) => Promise.resolve(value))
        .awaited()
        .toSorted((a, z) => a - z) satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort resolver parallel partial", async () => {
    expect(
      await (Yielded.from<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .awaited()
        .parallel(3)
        .toSorted((a, z) => a - z) satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });

  test("sort resolver parallel all", async () => {
    expect(
      await (Yielded.from<number>([500, 30, 100, 50])
        .map((value) => sleep(value).then(() => value))
        .awaited()
        .parallel(10)
        .toSorted((a, z) => a - z) satisfies Promise<number[]>),
    ).toStrictEqual([30, 50, 100, 500]);
  });
});
