import { describe, expect, test } from "vitest";
import { ParallelGenerator } from "../../src/generators/ParallelGenerator.ts";
import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";
import { delay } from "../utils/delay.ts";
import { MockIYieldedParallelGenerator } from "../utils/MockIYieldedParallelGenerator.ts";

function sourceGenerator(count: number): IYieldedParallelGenerator<number> {
  const numbers = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  console.log("numbes", numbers);
  return MockIYieldedParallelGenerator(numbers);
}

describe("ParallelGenerator", () => {
  test(
    "yields mapped async values in unordered mode",
    { timeout: 1000 },
    async () => {
      const gen = new ParallelGenerator<number, number>({
        generator: sourceGenerator(3),
        onNext: async (x) => [await delay((await x) * 2, 50 - (await x) * 10)],
        parallel: 3,
        maxBuffer: 10,
      });
      console.log("GET FIRST");
      await gen.next();
      console.log("GOT FIRST");
      return;

      const results: number[] = [];
      for await (const val of gen) {
        console.log("loop");
        results.push(val);
      }

      // unordered, so can be [6,4,2], but all values must be present
      expect(results.toSorted((a, b) => a - b)).toEqual([2, 4, 6]);
    },
  ); /*
      test("hello", () => {
        expect(1).toBe(1);
      }); /*
      test(
        "yields mapped async values in unordered mode",
        { timeout: 1000 },
        async () => {
          const gen = new ParallelGenerator<number, number>({
            generator: sourceGenerator(3),
            onNext: async (x) => [await delay((await x) * 2, 50 - (await x) * 10)],
            parallel: 3,
            maxBuffer: 10,
          });
          /*
          const results: number[] = [];
          for await (const val of gen) {
            console.log("loop");
            results.push(val);
          }

          // unordered, so can be [6,4,2], but all values must be present
          expect(results.toSorted((a, b) => a - b)).toEqual([2, 4, 6]); */
  /*
      expect(1).toBe(1);
    },
  );

  test.only("respects buffer limit", { timeout: 1000 }, async () => {
    const mapperCalls: number[] = [];
    const gen = new ParallelGenerator({
      generator: sourceGenerator(5),
      onNext: async (x) => {
        mapperCalls.push(await x);
        await delay(x, 10);
        return [x, (await x) + 0.5];
      },
      parallel: 3,
      maxBuffer: 2, // small buffer
    });

    const results: number[] = [];
    for await (const val of gen) {
      results.push(val);
    }

    // all values must eventually come out
    expect(results.length).toBe(10);
  });

  test("handles mapper returning undefined", async () => {
    const gen = new ParallelGenerator({
      generator: sourceGenerator(3),
      onNext: async (x) => ((await x) % 2 ? [x] : undefined),
      parallel: 2,
      maxBuffer: 5,
    });

    const results: number[] = [];
    for await (const val of gen) {
      results.push(val);
    }

    expect(results).toEqual([1, 3]);
  });

  test("handles mapper returning Iterable", async () => {
    const gen = new ParallelGenerator({
      generator: sourceGenerator(2),
      onNext: async (x) => [x, (await x) + 10],
      parallel: 2,
      maxBuffer: 5,
    });

    const results: number[] = [];
    for await (const val of gen) {
      results.push(val);
    }

    expect(results.sort((a, b) => a - b)).toEqual([1, 2, 11, 12]);
  });

  test("handles mapper returning AsyncIterable", async () => {
    const gen = new ParallelGenerator({
      generator: sourceGenerator(2),
      onNext: async function* (x) {
        const n = await x;
        yield n;
        yield n + 100;
      },
      parallel: 2,
      maxBuffer: 5,
    });

    const results: number[] = [];
    for await (const val of gen) {
      results.push(val);
    }

    expect(results.toSorted((a, b) => a - b)).toEqual([1, 2, 101, 102]);
  });

  test("stops when return() is called", async () => {
    const gen = new ParallelGenerator({
      generator: sourceGenerator(5),
      onNext: (x) => [x],
      parallel: 2,
      maxBuffer: 5,
    });

    const first = await gen.next();
    expect(await first.value).toBe(1);

    await gen.return();

    const second = await gen.next();
    expect(second.done).toBe(true);
  });

  test("propagates abort signal", async () => {
    const controller = new AbortController();
    const gen = new ParallelGenerator({
      generator: sourceGenerator(5),
      onNext: (x) => [delay(x, 10)],
      parallel: 2,
      maxBuffer: 5,
      signal: controller.signal,
    });

    const first = await gen.next();
    expect(await first.value).toBe(1);

    controller.abort();

    const second = await gen.next();
    expect(second.done).toBe(true);
  });

  test("handles large parallel workload", async () => {
    const count = 20;
    const gen = new ParallelGenerator({
      generator: sourceGenerator(count),
      onNext: async (x) => [delay(x, 5)],
      parallel: 10,
      maxBuffer: 50,
    });

    const results: number[] = [];
    for await (const val of gen) {
      results.push(val);
    }

    expect(results.sort((a, b) => a - b)).toEqual(
      [...Array(count).keys()].map((x) => x + 1),
    );
  });

  test("does not exceed parallel limit", async () => {
    let active = 0;
    let maxActive = 0;

    const gen = new ParallelGenerator({
      generator: sourceGenerator(10),
      onNext: async (x) => {
        active++;
        maxActive = Math.max(maxActive, active);
        await delay(x, 10);
        active--;
        return [x];
      },
      parallel: 3,
      maxBuffer: 5,
    });

    for await (const _ of gen) {
      /* empty */
  /*    }

      expect(maxActive).toBeLessThanOrEqual(3);
    }); */
});
