import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets";
import streamless from "../";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(
      streamless<number>([])
        .countBy((next) => next)
        .collect(),
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

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .countBy((next) => next.value)
        .collect() satisfies Promise<number>),
    ).toBe(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .countBy((next) => next.value)
        .collect() satisfies Promise<number>),
    ).toBe(6);
  });

  test("from promises", async () => {
    expect(
      await fromPromises
        .resolve()
        .countBy((next) => next.value)
        .collect(),
    ).toBe(6);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.countBy((next) => next.value).collect() satisfies number,
    ).toBe(6);
  });

  test("from array", () => {
    expect(
      fromArray.countBy((next) => next.value).collect() satisfies number,
    ).toBe(6);
  });

  test("from empty", () => {
    expect(
      fromEmpty.countBy((next) => next.value).collect() satisfies number,
    ).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .countBy((next) => next.value)
        .collect() satisfies Promise<number>),
    ).toBe(0);
  });

  test("from aborted", () => {
    const controller = new AbortController();
    controller.abort();
    expect(
      streamless([1, 2, 3])
        .countBy((next) => next)
        .collect(controller.signal) satisfies number,
    ).toBe(0);
  });

  test("from aborted async", async () => {
    const controller = new AbortController();
    controller.abort();
    expect(
      (await streamless([1, 2, 3])
        .resolve()
        .countBy((next) => next)
        .collect(controller.signal)) satisfies number,
    ).toBe(0);
  });
});
