import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";
import { DONE } from "../../src/utils.ts";

export function MockIYieldedParallelGenerator<T>(
  [...values]: Array<T | Promise<T>>,
  parallel = 1,
): IYieldedParallelGenerator<T> & Disposable {
  let disposed = false;
  return Object.assign(
    {
      [Symbol.asyncIterator]() {
        return this;
      },

      async [Symbol.asyncDispose]() {
        disposed = true;
      },
      async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
        if (disposed || !values.length) return DONE;
        const value = values.shift()!;
        return { value: Promise.resolve(value) };
      },

      async return() {
        disposed = true;
        return DONE;
      },

      async throw() {
        disposed = true;
        return DONE;
      },
    },
    {
      [Symbol.dispose]() {
        disposed = true;
      },
    },
  );
}
