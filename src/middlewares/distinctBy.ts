import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

export interface IYieldedDistinctBy<T, TAsync extends boolean> {
  /**
   * Filters out items produced by the generator that produce the same value
   * as the previous item when passed to the provided selector function.
   *
   * Only the first item in a sequence of consecutive items with the same
   * selector value is yielded to the next operation.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4])
   *   .distinctBy(n => n % 2)
   *   .toArray() satisfies number[] // [1, 2]
   * ```
   * ```ts
   * Yielded.from(['apple', 'apricot', 'banana', 'blueberry'])
   *   .distinctBy(fruit => fruit[0])
   *   .toArray() satisfies string[] // ['apple', 'banana']
   * ```
   */
  distinctBy<TValue>(
    selector: (next: T) => ICallbackReturn<TValue, TAsync>,
  ): INextYielded<T, TAsync>;
}

export function* distinctBySync<T, TSelect>(
  generator: IYieldedIterator<T>,
  selector: (next: T) => TSelect,
): IYieldedIterator<T> {
  const set = new Set<TSelect>();
  for (const next of generator) {
    const key = selector(next);
    if (set.has(key)) {
      continue;
    }
    set.add(key);
    yield next;
  }
}

export async function* distinctByAsync<T, TSelect>(
  generator: IYieldedAsyncGenerator<T>,
  selector: (next: T) => IPromiseOrNot<TSelect>,
): IYieldedAsyncGenerator<T> {
  const set = new Set<TSelect>();
  for await (const next of generator) {
    const key = await selector(next);
    if (set.has(key)) continue;
    set.add(key);
    yield next;
  }
}

export function distinctByParallel<T, TSelect>(
  generator: IYieldedParallelGenerator<T>,
  selector: (next: T) => IPromiseOrNot<TSelect>,
): IYieldedParallelGeneratorOnNext<T> {
  const set = new Set<TSelect>();
  return async (wrap) => {
    const next = await generator.next();
    if (next.done) return;
    const key = await selector(await next.value);
    if (set.has(key)) return;
    set.add(key);
    return wrap(next.value);
  };
}
