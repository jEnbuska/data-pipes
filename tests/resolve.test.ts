import { describe, expect, test } from "vitest";
import { AsyncYielded, Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("array resolve tests", () => {
  const numbers = [1, 2, 3];
  test("array test set", async () => {
    const {
      fromResolvedPromises,
      fromAsyncGenerator,
      fromGenerator,
      fromPromises,
      fromArray,
      fromEmpty,
      fromEmptyAsync,
    } = createTestSets(numbers);
    expect(
      await (fromResolvedPromises.toArray() satisfies Promise<number[]>),
    ).toStrictEqual(numbers);
    expect(
      (await fromAsyncGenerator.toArray()) satisfies number[],
    ).toStrictEqual(numbers);
    expect(
      await Promise.all(
        fromPromises.toArray() satisfies Array<Promise<number>>,
      ),
    ).toStrictEqual(numbers);
    expect(fromGenerator.toArray() satisfies number[]).toStrictEqual(numbers);
    expect(fromArray.toArray() satisfies number[]).toStrictEqual(numbers);
    expect(fromEmpty.toArray() satisfies number[]).toStrictEqual([]);
    expect(
      await (fromEmptyAsync.toArray() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });

  test("chainable to consume", async () => {
    const result = (await AsyncYielded.from(async function* () {
      yield* await Promise.resolve(numbers);
    }).toArray()) satisfies number[];
    expect(result).toStrictEqual(numbers);
  });
});
