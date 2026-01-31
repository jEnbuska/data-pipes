import { describe, expect, test } from "vitest";
import { throttleParallel } from "../src/utils.ts";
import { range } from "./utils/range.ts";
import { sleep } from "./utils/sleep.ts";

describe("throttle", () => {
  async function apply(n: number) {
    await sleep(n);
    return n;
  }

  test("throttle 3 with 3", async () => {
    const throttled = throttleParallel(apply, 3);
    const start = Date.now();
    expect(await throttled.previous()).toBe(undefined);
    const res = await Promise.all([
      throttled(100),
      throttled(0),
      throttled(50),
    ]);
    expect(Date.now() - start).toBeLessThan(50);
    expect(res.length).toBe(3);
    expect(res).toStrictEqual([0, 0, 0]);

    const second = await throttled.race();
    expect(second).toBe(50);
    expect(await throttled.previous()).toBe(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(50);
    expect(Date.now() - start).toBeLessThan(100);

    const third = await throttled.race();
    expect(third).toBe(100);
    expect(await throttled.previous()).toBe(100);
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
    expect(Date.now() - start).toBeLessThan(150);
  });
  test("throttle 3 with 5", async () => {
    const throttled = throttleParallel(apply, 3);
    const start = Date.now();
    expect(await throttled.previous()).toBe(undefined);
    const res = await Promise.all([
      throttled(100),
      throttled(150),
      throttled(50),
      throttled(25),
      throttled(30),
    ]);
    expect(res).toStrictEqual([50, 50, 50, 50, 50]);
    expect(await throttled.previous()).toBe(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(50);
    expect(Date.now() - start).toBeLessThan(100);

    const second = await throttled.race();
    expect(second).toBe(25);
    expect(await throttled.previous()).toBe(25);
    expect(Date.now() - start).toBeGreaterThanOrEqual(75);
    expect(Date.now() - start).toBeLessThan(100);

    const third = await throttled.race();
    expect(third).toBe(100);
    expect(await throttled.previous()).toBe(100);
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
    expect(Date.now() - start).toBeLessThan(150);

    const fourth = await throttled.race();
    expect(fourth).toBe(30);
    expect(await throttled.previous()).toBe(30);
    expect(Date.now() - start).toBeGreaterThanOrEqual(105);
    expect(Date.now() - start).toBeLessThan(150);

    const fifth = await throttled.race();
    expect(fifth).toBe(150);
    expect(await throttled.previous()).toBe(150);
    expect(Date.now() - start).toBeGreaterThanOrEqual(150);
    expect(Date.now() - start).toBeLessThan(200);

    expect(await throttled.race()).toBe(undefined);
  });

  test("throttle 1 race with 3", async () => {
    const throttled = throttleParallel(apply, 1);
    const start = Date.now();
    void Promise.all([throttled(100), throttled(0), throttled(50)]);

    expect(await throttled.previous()).toBe(undefined);
    expect(await throttled.race()).toBe(100);
    expect(await throttled.previous()).toBe(100);
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
    expect(Date.now() - start).toBeLessThan(150);

    await sleep(0);
    expect(await throttled.previous()).toBe(0);
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
    expect(Date.now() - start).toBeLessThan(150);

    expect(await throttled.race()).toBe(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(150);
    expect(Date.now() - start).toBeLessThan(200);

    expect(await throttled.race()).toBe(undefined);
  });

  test("stress test check 1", async () => {
    const throttled = throttleParallel(apply, 1);

    const promises = range(10_000).map(() => throttled(0));
    const started = Date.now();
    await Promise.all(promises);
    expect(Date.now() - started).toBeLessThan(100);
  });
  test("stress test check 5", async () => {
    const throttled = throttleParallel(apply, 5);
    const promises = range(10_000).map(() => throttled(0));
    const started = Date.now();
    await Promise.all(promises);
    expect(Date.now() - started).toBeLessThan(100);
  });
  test("stress test check 5", async () => {
    const throttled = throttleParallel(apply, 10_000);
    const promises = range(10_000).map(() => throttled(0));
    const started = Date.now();
    await Promise.all(promises);
    expect(Date.now() - started).toBeLessThan(100);
  });
  test("throttle race 2", async () => {
    const throttled = throttleParallel(apply, 2);
    const start = Date.now();

    expect(await throttled.previous()).toBe(undefined);

    void throttled(1000);
    void throttled(0);
    void throttled(500);
    void throttled(200);
    void throttled(400);
    void throttled(200);
    void throttled(0);
    // 0, 1000
    await sleep(0);
    expect(await throttled.previous()).toBe(0); // 0ms passed

    // 1000, 500
    expect(await throttled.race()).toBe(500); // 500ms passed
    // 1000, 200
    expect(await throttled.race()).toBe(200); // 70ms passed
    // 1000, 400
    expect(await throttled.race()).toBe(1000); // 1000ms passed
    // 400, 200
    expect(await throttled.race()).toBe(400); // 110ms passed
    // 200, 0
    await sleep(0);
    expect(await throttled.previous()).toBe(0); // 110ms passed
    expect(await throttled.race()).toBe(200); // 130ms passed

    expect(Date.now() - start).toBeGreaterThanOrEqual(1200);
    expect(Date.now() - start).toBeLessThan(1300);
  });

  test("throttle all 1 with 3", async () => {
    const arr: number[] = [];
    const throttled = throttleParallel(apply, 1);
    const start = Date.now();
    void throttled(1000).then((value) => {
      expect(value).toBe(1000);
      arr.push(value);
    });
    void throttled(0).then((value) => {
      expect(value).toBe(1000);
      arr.push(value);
    });
    void throttled(500).then((value) => {
      expect(value).toBe(1000);
      arr.push(value);
    });
    await throttled.all();
    expect(Date.now() - start).toBeGreaterThanOrEqual(1500);
    expect(Date.now() - start).toBeLessThan(1600);
    await sleep(0);
    expect(arr).toStrictEqual([1000, 1000, 1000]);
  });

  test("throttle all 2 with 5", async () => {
    const throttled = throttleParallel(apply, 2);
    const expectedOrder = [0, 600, 200, 1000, 200, 500];
    void throttled.onNext((value) => {
      expect(value).toBe(expectedOrder.shift());
    });
    void throttled(1000).then((value) => expect(value).toBe(0)); //
    void throttled(0).then((value) => expect(value).toBe(0)); //

    // 1000 (1000ms), 0* (0ms)
    await sleep(0);
    void throttled(600).then((value) => expect(value).toBe(600)); //
    void throttled(200).then((value) => expect(value).toBe(600)); //
    void throttled(500).then((value) => expect(value).toBe(600)); //
    void throttled(200).then((value) => expect(value).toBe(600));
    // 1000 (800ms), 600* (400ms) ... 200, 500, 200
    // 1000 (400ms) 200* (200ms) ... 500, 200
    // 1000* (200ms) 500 (500ms)... 200
    // 500 (300ms) 200* (200ms)
    // 500* (100ms)
    await throttled.all();
    await sleep(0);
    expect(expectedOrder).length(0);
  });

  test("throttle 1", { timeout: 15_000 }, async () => {
    const throttled = throttleParallel(apply, 1);
    const start = Date.now();
    const promises = await Promise.all([
      throttled(1000),
      throttled(0),
      throttled(500),
    ]);
    expect(await throttled.previous()).toBe(1000);
    for (const next of promises) {
      expect(next).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(999);
      expect(Date.now() - start).toBeLessThan(1100);
    }

    await sleep(0);
    expect(await throttled.previous()).toBe(0);

    // 500, 1500
    const first = await throttled(1500); // 1000ms
    expect(first).toBe(500); // 1500ms
    expect(Date.now() - start).toBeGreaterThanOrEqual(1500);
    expect(Date.now() - start).toBeLessThan(1600);

    await sleep();
    // 1500, 2000
    const second = await throttled(2000);
    expect(second).toBe(1500);
    expect(await throttled.previous()).toBe(1500);
    expect(Date.now() - start).toBeGreaterThanOrEqual(3000);
    expect(Date.now() - start).toBeLessThan(3100);

    // 2000, 3000
    const third = await throttled(3000);
    expect(third).toBe(2000);
    expect(await throttled.previous()).toBe(2000);
    expect(Date.now() - start).toBeGreaterThanOrEqual(5000);
    expect(Date.now() - start).toBeLessThan(5100);

    const fourth = await throttled.race();
    expect(fourth).toBe(3000);
    expect(await throttled.previous()).toBe(3000);
    expect(Date.now() - start).toBeGreaterThanOrEqual(8000);
    expect(Date.now() - start).toBeLessThan(8100);

    expect(await throttled.race()).toBe(undefined);
  });

  test("throttle 2", async () => {
    const arr: number[] = [];
    const push = arr.push.bind(arr);
    const throttledApply = throttleParallel(apply, 2);
    const start = Date.now();
    void throttledApply(500).then(push);
    void throttledApply(500).then(push);
    void throttledApply(500).then(push);
    await throttledApply.all();
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
    expect(Date.now() - start).toBeLessThan(1100);
    expect(arr).toStrictEqual([500, 500, 500]);
  });
});
