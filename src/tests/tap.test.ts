import { describe, test, expect } from "vitest";
import yielded from "../index.ts";
import { createTestSets } from "./utils/createTestSets.ts";
import { simpleMock } from "./utils/simpleMock.ts";

describe("tap", () => {
  test("chainable single value", () => {
    let called = 0;
    const callback = (n: number) => {
      called++;
      expect(n).toBe(1);
    };
    yielded(1).tap(callback).consume();
    expect(called).toBe(1);
  });

  test("with multiple", () => {
    const args = [1, 2];
    let called = 0;
    const callback = () => called++;

    yielded(args).tap(callback).consume();
    expect(called).toBe(2);
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
    const callback = simpleMock(args);
    fromSingle.tap(callback).consume() satisfies void;
    expect(callback.called).toHaveBeenCalledTimes(1);
  });

  test("from resolved promises", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);

    await (fromResolvedPromises
      .tap(callback)
      .consume() satisfies Promise<void>);

    expect(callback.called).toBe(2);
  });

  test("from async generator", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);

    await (fromAsyncGenerator.tap(callback).consume() satisfies Promise<void>);
    expect(callback.called).toBe(2);
  });

  test("from promises", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);
    (await fromPromises.toAwaited().tap(callback).consume()) satisfies void;
    expect(callback.called).toBe(2);
  });

  test("from generator", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);
    fromGenerator.tap(callback).consume() satisfies void;
    expect(callback.called).toBe(2);
  });

  test("from array", () => {
    const args = [1, 2];
    const callback = simpleMock(args);
    fromArray.tap(callback).consume() satisfies void;
    expect(callback.called).toBe(2);
  });

  test("from empty", () => {
    const args = [1, 2];
    const callback = simpleMock(args);
    fromEmpty.tap(callback).consume() satisfies void;
    expect(callback.called).toBe(2);
  });

  test("from empty async", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);
    await (fromEmptyAsync.tap(callback).consume() satisfies Promise<void>);
    expect(callback.called).toBe(0);
  });
});
