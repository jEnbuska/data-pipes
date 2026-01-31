import { resolveParallel } from "../../resolvers/resolveParallel.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { DONE, throttleParallel } from "../../utils.ts";

export function toParallel<T>(
  generator: IYieldedAsyncGenerator<T> | IYieldedIterator<T>,
  count: number,
): IYieldedParallelGenerator<T> {
  let done = false;
  function onDone() {
    done = true;
    return DONE;
  }
  const getNext = throttleParallel(async function (): Promise<
    IteratorResult<Promise<T>, void>
  > {
    if (done) return DONE;
    const next = await generator.next();
    if (done) return DONE;
    if (next.done || done) {
      while (getNext.count() > 1) await getNext.race();
      return onDone();
    }
    return {
      value: Promise.resolve(next.value),
    };
  }, count);

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async [Symbol.asyncDispose]() {
      onDone();
    },
    async next(): Promise<IteratorResult<Promise<T>, void>> {
      if (done) return DONE;
      return getNext();
    },

    async return() {
      void generator.return?.();
      return onDone();
    },

    async throw(error) {
      void generator.throw?.(error);
      return onDone();
    },
  };
}

// change to number of parallel downstream
export function parallelUpdate<T>(
  generator: IYieldedParallelGenerator<T>,
  count: number,
): IYieldedParallelGenerator<T> {
  const buffer = new Array<T>();
  let disposed = false;
  const parallelGenerator = Object.assign(
    {
      [Symbol.asyncIterator]() {
        return this;
      },

      async [Symbol.asyncDispose]() {
        disposed = true;
      },
      async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
        if (disposed || !buffer.length) return DONE;
        const value = buffer.shift()!;
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

  void resolveParallel({
    generator,
    parallel: count,
    onNext(next, resolve) {
      if (disposed) {
        resolve(undefined);
      }
      buffer.push(next);
      void parallelGenerator.next();
    },
    onDone() {
      void parallelGenerator.return();
    },
  });
  return parallelGenerator;
}
