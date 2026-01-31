import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { sleep } from "./utils/sleep.ts";

describe("parallel", () => {
  test("Parallel with empty list", { timeout: 100 }, async () => {
    const result = (await Yielded.from([] as number[])
      .awaited()
      .parallel(2)
      .toArray()) satisfies number[];
    expect(result).toStrictEqual([]);
  });
  test("Parallel with all at once", async () => {
    const result = await (Yielded.from([500, 404, 100, 300, 200])
      .awaited()
      .parallel(5)
      .map((it) => sleep(it).then(() => it))
      .toArray() satisfies Promise<number[]>);
    expect(result).toStrictEqual([100, 200, 300, 404, 500]);
  });

  test("Parallel with 3 parallel count", async () => {
    const result = (await Yielded.from([550, 450, 300, 10, 100])
      .awaited()
      .parallel(3)
      .map(async (it) => sleep(it).then(() => it))
      .toArray()) satisfies number[];
    expect(result).toStrictEqual([300, 10, 100, 450, 550]);
  });

  test("Parallel to awaited", async () => {
    const result = (await Yielded.from([550, 450, 300, 10, 100])
      .awaited()
      .parallel(3)
      .map(async (it) => sleep(it).then(() => it))
      .parallel(1)
      .toArray()) satisfies number[];
    expect(result).toStrictEqual([300, 10, 100, 450, 550]);
  });
});
