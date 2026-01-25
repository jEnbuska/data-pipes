import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";
import { sleep } from "./utils/sleep.ts";

describe("parallel", () => {
  test("Parallel with empty list", async () => {
    const result = (await yielded([] as number[])
      .map((it) => it)
      .awaited()
      .parallel(10)
      .toArray()) satisfies number[];

    expect(result).toStrictEqual([]);
  });
  test("Parallel with all at once", async () => {
    const result = await (yielded([500, 404, 100, 300, 200])
      .map(async (it) => {
        return await sleep(it).then(() => it);
      })
      .awaited(5)
      .parallel(5)
      .toArray() satisfies Promise<number[]>);
    expect(result).toStrictEqual([100, 200, 300, 404, 500]);
  });

  test("Parallel with 3 parallel count", async () => {
    const result = (await yielded([550, 450, 300, 10, 100])
      .map(async (it) => sleep(it).then(() => it))
      .awaited()
      .parallel(3)
      .toArray()) satisfies number[];
    expect(result).toStrictEqual([300, 10, 100, 450, 550]);
  });
});
