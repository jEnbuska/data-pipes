import { describe, expect, test } from "vitest";
import { Yielded } from "../../src/index.ts";
import { sleep } from "../utils/sleep.ts";

describe("parallel", { timeout: 5000 }, () => {
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

  test.only("Parallel to awaited", { timeout: 4000 }, async () => {
    const tapped: number[] = [];
    const result = (await Yielded.from([300, 200, 100, 0])
      .tap((n) => console.log("tap (0)", n))
      .awaited()
      .tap((n) => console.log("tap (1)", n))
      .parallel(5)
      .tap((n) => console.log("tap (2)", n))
      .map(async (it) => sleep(it).then(() => it))
      .tap((n) => console.log("tap (3)", n))
      .tap((n) => {
        tapped.push(n);
      })
      .parallel(1)
      .map(async (it, index) => {
        return sleep(400 - index * 50).then(() => it);
      })
      // .tap((value) => console.log("got", value))
      .toArray()) satisfies number[];
    console.log("tapped", tapped);
    expect(tapped).toStrictEqual([0, 100, 200, 300]);
  });
});
