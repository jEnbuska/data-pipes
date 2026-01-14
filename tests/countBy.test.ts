import { describe, test, expect } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";
import yielded from "../src/index.ts";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(
      yielded<number>([])
        .countBy((next) => next)
        .resolve(),
    ).toBe(0);
  });

  const objects = [{ value: 1 }, { value: 2 }, { value: 3 }];
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(objects);

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises
        .countBy((next) => next.value)
        .resolve() satisfies Promise<number>),
    ).toBe(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .countBy((next) => next.value)
        .resolve() satisfies Promise<number>),
    ).toBe(6);
  });

  test("from promises", async () => {
    expect(
      await fromPromises
        .toAwaited()
        .countBy((next) => next.value)
        .resolve(),
    ).toBe(6);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.countBy((next) => next.value).resolve() satisfies number,
    ).toBe(6);
  });

  test("from array", () => {
    expect(
      fromArray.countBy((next) => next.value).resolve() satisfies number,
    ).toBe(6);
  });

  test("from empty", () => {
    expect(
      fromEmpty.countBy((next) => next.value).resolve() satisfies number,
    ).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .countBy((next) => next.value)
        .resolve() satisfies Promise<number>),
    ).toBe(0);
  });

  test("from aborted", () => {
    const controller = new AbortController();
    controller.abort();
    expect(
      yielded([1, 2, 3])
        .countBy((next) => next)
        .resolve(controller.signal) satisfies number,
    ).toBe(0);
  });

  test("from aborted async", async () => {
    const controller = new AbortController();
    controller.abort();
    expect(
      (await yielded([1, 2, 3])
        .toAwaited()
        .countBy((next) => next)
        .resolve(controller.signal)) satisfies number,
    ).toBe(0);
  });
});
