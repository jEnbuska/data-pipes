import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";

export function MockIYieldedParallelGenerator<T>([...values]: Array<
  Promise<T> | T
>): IYieldedParallelGenerator<T> & Disposable {
  let disposed = false;
  return Object.assign(
    {
      [Symbol.asyncIterator]() {
        return this as any;
      },

      async [Symbol.asyncDispose]() {
        disposed = true;
      },
      async next(): Promise<IteratorResult<Promise<T>, void>> {
        if (disposed || !values.length) {
          return { done: true, value: undefined } as const;
        }
        const value = values.shift()!;
        return { value: Promise.resolve(value), done: false };
      },

      async return() {
        disposed = true;
        return { done: true, value: undefined } as const;
      },

      async throw() {
        disposed = true;
        return { done: true, value: undefined } as const;
      },
    },
    {
      [Symbol.dispose]() {
        disposed = true;
      },
    },
  );
}
