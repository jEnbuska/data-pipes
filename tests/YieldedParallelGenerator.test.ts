import { describe, expect, test } from "vitest";
import { ParallelYielded } from "../src/generators/ParallelYielded.ts";
import { YieldedParallelGenerator } from "../src/generators/YieldedParallelGenerator.ts";
import { MockIYieldedParallelGenerator } from "./utils/MockIYieldedParallelGenerator.ts";
import { delay } from "./utils/sleep.ts";

describe("YieldedParallelGenerator", () => {
  describe("handleNext YIELD", () => {
    test("empty generator, parallel 1", async () => {
      const generator = YieldedParallelGenerator.create({
        generator: MockIYieldedParallelGenerator([]),
        parallel: 1,
        handleNext() {
          throw new Error("Should not be called");
        },
      });
      const result = await generator.next();
      expect(result.done).toBe(true);
    });
    test("empty generator, parallel 3", async () => {
      const generator = YieldedParallelGenerator.create({
        generator: MockIYieldedParallelGenerator([]),
        parallel: 1,
        handleNext() {
          throw new Error("Should not be called");
        },
      });
      const result = await generator.next();
      expect(result.done).toBe(true);
    });

    test("generator with one sync, parallel 1", async () => {
      const generator = YieldedParallelGenerator.create<number>({
        generator: MockIYieldedParallelGenerator([1]),
        parallel: 1,
        handleNext(next) {
          return { type: "YIELD", payload: next };
        },
      });
      const result1 = await generator.next();
      expect(result1.done).toBe(false);
      expect(await result1.value).toBe(1);
      const result2 = await generator.next();
      expect(result2.done).toBe(true);
    });

    test("generator with 5 sync, parallel 1", async () => {
      const values = [1, Promise.resolve(2), 3, 4, 5];
      const generator = YieldedParallelGenerator.create<number>({
        generator: MockIYieldedParallelGenerator(values),
        parallel: 1,
        handleNext(next) {
          return { type: "YIELD", payload: next };
        },
      });
      for (const value of values) {
        const result = await generator.next();
        expect(result.done).toBe(false);
        expect(await result.value).toBe(await value);
      }
      const { done } = await generator.next();
      expect(done).toStrictEqual(true);
    });

    test("generator with 5 sync, parallel 5", async () => {
      const values = [1, Promise.resolve(2), 3, 4, 5];
      const generator = YieldedParallelGenerator.create<number>({
        generator: MockIYieldedParallelGenerator(values),
        parallel: 5,
        handleNext(next) {
          return { type: "YIELD", payload: next };
        },
      });
      for (const value of values) {
        const result = await generator.next();
        expect(result.done).toBe(false);
        expect(await result.value).toBe(await value);
      }
      const { done } = await generator.next();
      expect(done).toStrictEqual(true);
    });
  });
  describe("toArray", () => {
    const inputTemplate = [
      [1, 100],
      [2, 50],
      [3, 0],
      [4, 400],
      [5, 300],
    ] as const;
    const input = inputTemplate.map(([v, ms]) => delay(v, ms));

    test("generator with 5 async, parallel 5", async () => {
      const array = await new ParallelYielded(
        MockIYieldedParallelGenerator(input),
        YieldedParallelGenerator.create<number>({
          generator: MockIYieldedParallelGenerator(input),
          parallel: 5,
          handleNext(next) {
            return { type: "YIELD", payload: next };
          },
        }),
        5,
      ).toArray();

      const expected = inputTemplate
        .toSorted((a, b) => a[1] - b[1])
        .map(([v]) => v);
      expect(array).toEqual(expected);
    });

    test.only("generator with 5 async, parallel 3", async () => {
      const array = await new ParallelYielded(
        MockIYieldedParallelGenerator(input),
        YieldedParallelGenerator.create<number>({
          generator: MockIYieldedParallelGenerator(input),
          parallel: 3,
          handleNext(next) {
            return { type: "YIELD", payload: next };
          },
        }),
        3,
      ).toArray();

      const expected = inputTemplate
        .toSorted((a, b) => a[1] - b[1])
        .map(([v]) => v);
      expect(array).toEqual(expected);
    });
  });
});
