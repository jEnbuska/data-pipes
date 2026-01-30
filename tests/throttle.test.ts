import { describe, expect, test } from "vitest";
import { throttle } from "../src/utils.ts";
import { sleep } from "./utils/sleep.ts";

describe("throttle", () => {
  test("throttle 1", async () => {
    const arr: number[] = [];
    async function apply(n: number) {
      await sleep(n);
      return n;
    }
    const push = arr.push.bind(arr);
    const throttledApply = throttle(apply, 1);
    const start = Date.now();
    void throttledApply(50).then(push);
    void throttledApply(50).then(push);
    void throttledApply(50).then(push);
    await throttledApply.waitForIdle();
    expect(Date.now() - start).toBeGreaterThanOrEqual(150);
    expect(arr).toStrictEqual([50, 50, 50]);
  });

  test("throttle 2", async () => {
    const arr: number[] = [];
    async function apply(n: number) {
      await sleep(n);
      return n;
    }
    const push = arr.push.bind(arr);
    const throttledApply = throttle(apply, 2);
    const start = Date.now();
    void throttledApply(50).then(push);
    void throttledApply(50).then(push);
    void throttledApply(50).then(push);
    await throttledApply.waitForIdle();
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
    expect(Date.now() - start).toBeLessThan(150);
    expect(arr).toStrictEqual([50, 50, 50]);
  });
});
