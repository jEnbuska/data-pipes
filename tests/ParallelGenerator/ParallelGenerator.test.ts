import { describe, expect, test } from "bun:test";
import { ParallelGenerator } from "../../src/generators/ParallelGenerator.ts";
import { delay } from "../utils/delay.ts";
import { getParallelResult } from "../utils/getParallelResult.ts";
import { parallelSource } from "../utils/parallelSource.ts";

describe("ParallelGenerator multi parallel", () => {
  test(
    "yields mapped async values in unordered mode",
    async () => {
      const gen = ParallelGenerator.create<number, number>({
        generator: parallelSource(3),
        onNext: async (x): Promise<Promise<number>[]> => [
          delay((await x) * 2, 50 - (await x) * 10),
        ],
        parallel: 3,
      });

      const results = await getParallelResult(gen);
      // unordered, so can be [6,4,2], but all values must be present
      expect(results.toSorted((a, b) => a - b)).toEqual([2, 4, 6]);
    },
    { timeout: 1000 },
  );

  test(
    "respects buffer limit",
    async () => {
      const mapperCalls: number[] = [];
      const gen = ParallelGenerator.create<number, number>({
        generator: parallelSource(5),
        onNext: async (x): Promise<Promise<number>[]> => {
          mapperCalls.push(await x);
          await delay(x, 10);
          return [Promise.resolve(x), Promise.resolve((await x) + 0.5)];
        },
        parallel: 3,
      });
      const results = await getParallelResult(gen);
      // all values must eventually come out
      expect(results.length).toBe(10);
    },
    { timeout: 1000 },
  );

  test("handles mapper returning undefined", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(3),
      onNext: async (x) => ((await x) % 2 ? [x] : undefined),
      parallel: 2,
    });
    const results = await getParallelResult(gen);
    expect(results).toEqual([1]);
  });

  test("handles mapper returning Iterable", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(2),
      onNext: async (x) => [x, (await x) + 10],
      parallel: 2,
    });

    const results = await getParallelResult(gen);
    expect(results.sort((a, b) => a - b)).toEqual([1, 2, 11, 12]);
  });

  test("handles mapper returning AsyncIterable", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(2),
      onNext: async function* (x) {
        const n = await x;
        yield n;
        yield n + 100;
      },
      parallel: 2,
    });
    const results = await getParallelResult(gen);
    expect(results.toSorted((a, b) => a - b)).toEqual([1, 2, 101, 102]);
  });

  test("stops when return() is called", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(5),
      onNext: (x) => [x],
      parallel: 2,
    });

    const first = await gen.next();
    expect(await first.value).toBe(1);

    await gen.return();

    const second = await gen.next();
    expect(second.done).toBe(true);
  });

  test("handles large parallel workload", async () => {
    const count = 20;
    const gen = ParallelGenerator.create({
      generator: parallelSource(count),
      onNext: async (x) => [delay(x, 5)],
      parallel: 10,
    });

    const results = await getParallelResult(gen);

    expect(results.sort((a, b) => a - b)).toEqual(
      [...Array(count).keys()].map((x) => x + 1),
    );
  });

  test("does not exceed parallel limit", async () => {
    let active = 0;
    let maxActive = 0;

    const gen = ParallelGenerator.create({
      generator: parallelSource(10),
      onNext: async (x) => {
        active++;
        maxActive = Math.max(maxActive, active);
        await delay(x, 10);
        active--;
        return [x];
      },
      parallel: 3,
    });

    void (await getParallelResult(gen));

    expect(maxActive).toBeLessThanOrEqual(3);
  });
});
