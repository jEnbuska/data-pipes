import { describe, expect, test } from "bun:test";
import { ParallelGenerator } from "../../src/generators/ParallelGenerator.ts";
import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";
import { delay } from "../utils/delay.ts";
import { getParallelResult } from "../utils/getParallelResult.ts";
import { parallelSource } from "../utils/parallelSource.ts";

describe("ParallelGeneratorCreate", () => {
  test("type list & undefined", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(2),
      onNext: async (n) => ((await n) === 2 ? undefined : [1, 1]),
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 1]);
  });
  test("type from list", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: (_) => [1, 2, 3],
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 2, 3]);
  });
  test("type from promise", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: (x) => [x satisfies Promise<number>],
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1]);
  });
  test("type from async list", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: async (_) => [2],
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([2]);
  });
  test("type from async promise", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: async (x) => [1, x satisfies Promise<number>, 1],
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 1, 1]);
  });

  test("type inferred generator function", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: function* (x) {
        yield x;
        yield 2;
        yield* [x, 3];
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;

    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 2, 1, 3]);
  });

  test("type inferred async generator function", async () => {
    const gen = ParallelGenerator.create({
      generator: parallelSource(1),
      onNext: async function* (x) {
        yield x;
        yield 2;
        yield* [x, 3];
        yield* [];
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 2, 1, 3]);
  });

  test("type iterable", async () => {
    const gen = ParallelGenerator.create<number, number>({
      generator: parallelSource(1),
      onNext: function (x) {
        let done = false;
        return {
          next() {
            if (done) return { done: true, value: undefined } as const;
            done = true;
            return {
              value: x,
              done: false,
            } as const;
          },
        };
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1]);
  });

  test("type iterable from async", async () => {
    const gen = ParallelGenerator.create<number, number>({
      generator: parallelSource(1),
      onNext: async function (x) {
        let done = false;
        return {
          next() {
            if (done) return { done: true, value: undefined } as const;
            done = true;
            return {
              value: x,
              done: false,
            } as const;
          },
        };
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1]);
  });

  test("type async iterable from async", async () => {
    const gen = ParallelGenerator.create<number, number>({
      generator: parallelSource(1),
      onNext: async function (x) {
        let done = false;
        return {
          async next() {
            if (done) return { done: true, value: undefined } as const;
            done = true;
            return {
              value: x,
              done: false,
            } as const;
          },
        };
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1]);
  });

  test("from list and done", async () => {
    const gen = ParallelGenerator.create<number, number>({
      generator: parallelSource(1),
      onDone() {
        return [2, delay(3, 10)];
      },
      onNext: async function (x) {
        return [delay(x, 10)];
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([1, 2, 3]);
  });

  test("from onDone", async () => {
    const gen = ParallelGenerator.create<number, number>({
      generator: parallelSource(1),
      onDone() {
        return [2, delay(3, 10)];
      },
      onNext: async function () {
        return undefined;
      },
      parallel: 2,
    }) satisfies IYieldedParallelGenerator<number>;
    const results = await getParallelResult(gen);
    expect(results).toStrictEqual([2, 3]);
  });
});
