import type {
  CallbackReturn,
  NextYielded,
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
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
    selector: (next: T) => CallbackReturn<TValue, TAsync>,
  ): NextYielded<T, TAsync>;
}

export function* distinctBySync<T, TSelect>(
  generator: YieldedIterator<T>,
  selector: (next: T) => TSelect,
): YieldedIterator<T> {
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
  generator: YieldedAsyncGenerator<T>,
  selector: (next: T) => PromiseOrNot<TSelect>,
): YieldedAsyncGenerator<T> {
  const set = new Set<TSelect>();
  for await (const next of generator) {
    const key = await selector(next);
    if (set.has(key)) continue;
    set.add(key);
    yield next;
  }
}
