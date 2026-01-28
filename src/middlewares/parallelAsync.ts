import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { DONE } from "../utils.ts";

export function parallelAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  count: number,
): IYieldedParallelGenerator<T> {
  if (count <= 1) {
    throw new Error(`parallel count must be larger than 1, but got ${count}`);
  }
  const promises = new Map<
    number,
    Promise<{ key: number } & IteratorResult<T>>
  >();
  let nextKey = 0;
  const wasDone = false;
  function add(next: Promise<IteratorResult<T>> | IteratorResult<T>) {
    const key = nextKey++;
    promises.set(
      key,
      Promise.resolve(next).then(({ value, done: isDone }) => {
        return {
          key,
          value,
          done: isDone || wasDone,
        };
      }),
    );
  }
  /* Trigger 'count' amount for tasks to be run parallel */
  while (promises.size < count) {
    add(generator.next());
  }
  let isDone = false;
  return {
    async [Symbol.asyncDispose]() {
      isDone = true;
    },
    async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
      if (isDone) return DONE;
      const result = await Promise.race(promises.values());
      promises.delete(result.key);
      if (result.done) return result;
      // Add next task to be executed
      add(generator.next());
      return { done: false, value: result.value as Promise<T> };
    },
    async return(): Promise<IteratorResult<Promise<T>, void>> {
      isDone = true;
      return DONE;
    },

    async throw(): Promise<IteratorResult<Promise<T>, void>> {
      isDone = true;
      return DONE;
    },

    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

export function parallelParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  count: number,
): IYieldedParallelGenerator<T> {
  if (count <= 1) {
    throw new Error(`parallel count must be larger than 1, but got ${count}`);
  }
  const promises = new Map<
    number,
    Promise<{ key: number } & IteratorResult<T>>
  >();
  let nextKey = 0;
  const wasDone = false;
  function add(
    next: Promise<IteratorResult<Promise<T>>> | IteratorResult<Promise<T>>,
  ) {
    const key = nextKey++;
    promises.set(
      key,
      Promise.resolve(next).then(({ value, done: isDone }) => {
        return {
          key,
          value,
          done: isDone || wasDone,
        };
      }),
    );
  }
  /* Trigger 'count' amount for tasks to be run parallel */
  while (promises.size < count) {
    add(generator.next());
  }
  let isDone = false;
  return {
    async [Symbol.asyncDispose]() {
      isDone = true;
    },
    async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
      if (isDone) return DONE;
      const result = await Promise.race(promises.values());
      promises.delete(result.key);
      if (result.done) return result;
      // Add next task to be executed
      add(generator.next());
      return { done: false, value: result.value as Promise<T> };
    },
    async return(): Promise<IteratorResult<Promise<T>, void>> {
      isDone = true;
      return DONE;
    },

    async throw(): Promise<IteratorResult<Promise<T>, void>> {
      isDone = true;
      return DONE;
    },

    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
