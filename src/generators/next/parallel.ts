import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { DONE } from "../../utils.ts";

export function parallel<T>(
  generator: IYieldedAsyncGenerator<T>,
  parallel: number,
): IYieldedParallelGenerator<T> {
  const parallelQueue: Array<Promise<IteratorResult<T, void>>> = [];
  let exhausted = false;
  let resolvable = Promise.withResolvers<IteratorResult<T, void>>();

  async function getNext(): Promise<IteratorResult<Promise<T>, void>> {
    while (parallel && !exhausted) {
      void onNext(generator.next());
    }
    while (true) {
      const result = await Promise.race(parallelQueue);
      if (!result.done) return { value: Promise.resolve(result.value) };
      if (!parallelQueue.length) return result;
    }
  }

  async function onNext(next: Promise<IteratorResult<T, void>>) {
    parallel--;
    parallelQueue.push(next);
    const result = await next;
    if (result.done) {
      exhausted = true;
    }
    parallel++;
    resolvable.resolve(result);
    resolvable = Promise.withResolvers<IteratorResult<T, void>>();
  }

  function dispose() {
    void generator.return();
    return DONE;
  }
  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    async [Symbol.asyncDispose]() {
      dispose();
    },
    async next(..._: [] | [void]): Promise<IteratorResult<Promise<T>, void>> {
      return getNext();
    },

    async return() {
      return dispose();
    },

    async throw() {
      return dispose();
    },
  };
}
