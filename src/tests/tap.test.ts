import { describe, test, mock, expect } from "bun:test";
import streamless from "../";
import { createTestSets } from "./utils/createTestSets";

describe("tap", () => {
  test("chainable single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    streamless(1).tap(callback).consume();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  const createCallback = (args: number[]) => {
    let index = 0;
    return mock((n: number) => {
      const expected = args[index++];
      expect(n).toBe(expected);
    });
  };
  test("with multiple", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    streamless(args).tap(callback).consume();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  const numbers = [1, 2];
  const {
    fromResolvedPromises,
    fromSingle,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);
  test("from single", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromSingle.tap(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("from resolver promises", async () => {
    const args = [1, 2];
    const callback = createCallback(args);

    await (fromResolvedPromises
      .tap(callback)
      .consume() satisfies Promise<void>);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from async generator", async () => {
    const args = [1, 2];
    const callback = createCallback(args);

    await (fromAsyncGenerator.tap(callback).consume() satisfies Promise<void>);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from promises", async () => {
    const args = [1, 2];
    const callback = createCallback(args);
    (await fromPromises.resolve().tap(callback).consume()) satisfies void;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from generator", async () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromGenerator.tap(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from array", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromArray.tap(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from empty", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromEmpty.tap(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("from empty async", async () => {
    const args = [1, 2];
    const callback = createCallback(args);
    await (fromEmptyAsync.tap(callback).consume() satisfies Promise<void>);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
