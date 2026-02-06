import type { VitestUtils } from "vitest";
import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";
import { delay } from "./delay.ts";

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

export function MockDelayedValuesGenerator<T>(
  utils: VitestUtils,
  values: Array<[delayMs: number, T]>,
): IYieldedParallelGenerator<T> & Disposable {
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
        const [delayMs, value] = values.shift()!;
        const result = { value: delay(value, delayMs), done: false as const };
        void utils.advanceTimersToNextTimerAsync();
        return result;
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
