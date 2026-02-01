import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { DONE, throttleParallel } from "../../utils.ts";
import type { IAsyncYielded } from "../../yielded.types.ts";
import { mapParallel } from "./map.ts";

export type IYieldedParallel<T> = {
  /**
   * Enables parallel processing for the **next asynchronous operation**.
   *
   * By default, items are processed sequentially (one at a time).
   * Calling `parallel(count)` configures the pipeline so that the
   * **following async-producing operation** may run with up to
   * `count` items in flight simultaneously.
   *
   * This setting does not retroactively affect previous operations
   * in the pipeline — it applies only to the next async operation.
   *
   * As soon as one operation completes, the next pending item
   * is started, keeping at most `count` operations active.
   *
   * Results are yielded in **order of completion**, not in the
   * original input order.
   *
   * This is useful for increasing throughput when performing
   * independent asynchronous work such as network requests,
   * timers, or I/O.
   *
   * @example
   * ```ts
   * Yielded.from([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .awaited()
   *  .parallel(3)
   *  .toArray() // Promise<[300, 10, 100, 450, 550]>
   */
  parallel(count: number): IAsyncYielded<T>;
};

export function generatorToParallel<T>(
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
    if (next.done) return onDone();
    console.log("generatorToParallel", next.value);
    return {
      value: Promise.resolve(next.value),
    };
  }, count);

  return {
    [Symbol.asyncIterator]() {
      return this as any;
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
export function parallelThrottleUpdate<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): IYieldedParallelGenerator<T> {
  return mapParallel(generator, parallel, (next) => next);
}
