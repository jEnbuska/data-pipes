import {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { DONE, throttleParallel } from "../../utils.ts";

export function parallel<T>(
  generator: IYieldedAsyncGenerator<T> | IYieldedIterator<T>,
  parallel: number,
): IYieldedParallelGenerator<T> {
  let done = false;
  function onDone() {
    done = true;
    return DONE;
  }
  const getNext = throttleParallel(async function (): Promise<
    IteratorResult<Promise<T>, void>
  > {
    if (done) return onDone();
    const next = await generator.next();
    if (next.done || done) {
      await getNext.all();
      return onDone();
    }
    return {
      value: Promise.resolve(next.value),
    };
  }, parallel);

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async [Symbol.asyncDispose]() {
      onDone();
    },
    async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
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
