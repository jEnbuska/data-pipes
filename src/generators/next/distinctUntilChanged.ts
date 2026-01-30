import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { locked } from "../../utils.ts";
import { YieldedParallelGenerator } from "../YieldedParallelGenerator.ts";

export interface IYieldedDistinctUntilChanged<T, TAsync extends boolean> {
  /**
   * Filters out items produced by the generator that are equal to the previous
   * item, according to the provided comparator function. Only the first item
   * in a sequence of consecutive duplicates is yielded.
   *
   * If no comparator is provided, the strict equality operator (`===`) is used
   * by default.
   *
   * Supports both synchronous and asynchronous generators. When `TAsync` is
   * `true`, the comparator may return a `Promise<boolean>`, and the filtering
   * will correctly handle async values.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 2, 2, 3])
   *   .distinctUntilChanged()
   *   .toArray() satisfies number[] // [1, 2, 3]
   * ```
   * ```ts
   * Yielded.from(['apple', 'apricot', 'banana', 'blueberry', 'cherry'])
   *   .distinctUntilChanged((previous, current) => previous[0] === current[0])
   *   .toArray() satisfies string[] // ['apple', 'banana', 'cherry']
   * ```
   */
  distinctUntilChanged(
    comparator?: (previous: T, current: T) => ICallbackReturn<boolean, TAsync>,
  ): INextYielded<T, TAsync>;
}

export function* distinctUntilChangedSync<T>(
  generator: IYieldedIterator<T>,
  compare: (previous: T, current: T) => boolean = defaultCompare,
): IYieldedIterator<T> {
  const first = generator.next();
  if (first.done) return;
  let previous = first.value;
  yield previous;
  for (const next of generator) {
    if (!compare(previous, next)) {
      previous = next;
      yield next;
    }
  }
}

export async function* distinctUntilChangedAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  compare: (previous: T, current: T) => IPromiseOrNot<boolean> = defaultCompare,
): IYieldedAsyncGenerator<T> {
  const first = await generator.next();
  if (first.done) return;
  let previous = first.value;
  yield previous;
  for await (const next of generator) {
    if (!(await compare(previous, next))) {
      previous = next;
      yield next;
    }
  }
}

export function distinctUntilChangedParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  compare: (previous: T, current: T) => IPromiseOrNot<boolean> = defaultCompare,
): IYieldedParallelGenerator<T> {
  const lockedCompare = locked(
    async (previous: Promise<T>, next: Promise<T>) => {
      return compare(await previous, await next);
    },
  );
  let previous: Promise<T> | undefined;
  return YieldedParallelGenerator.create<T>({
    generator,
    parallel,
    async handleNext(next) {
      if (!previous) {
        previous = next;
        return { type: "YIELD", payload: next };
      }
      if (await lockedCompare(previous, next)) {
        previous = next;
        return { type: "YIELD", payload: next };
      }
      return { type: "CONTINUE" };
    },
  });
}

function defaultCompare<T>(a: T, b: T) {
  return a === b;
}
