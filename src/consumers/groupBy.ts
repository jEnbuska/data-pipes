import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
} from "../shared.types.ts";

export interface IYieldedGroupBy<T, TAsync extends boolean> {
  /**
   * Groups items produced by the generator using a key derived from each item.
   *
   * Each item is assigned to a group based on the value returned by
   * `keySelector`. The result is an object whose keys are group identifiers
   * and whose values are arrays of items belonging to each group.
   *
   * When the optional `groups` array is provided, the returned object is
   * guaranteed to contain **at least** those group keys. Groups that are
   * listed but not produced by the input will be present with an empty array.
   *
   * Groups that are produced by `keySelector` but not listed in `groups`
   * may still appear in the result, but are typed as optional.
   *
   * @example
   * ```ts
   * Yielded.from([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even') satisfies Partial<Record<'odd' | 'even', number[]>>
   *    // {even: [2,4], odd: [1,3,5]}
   *  ```
   * ```ts
   * Yielded.from([1,2,3,4,5])
   *  .groupBy(
   *    n => n % 2 ? 'odd' : 'even',
   *    ['odd', 'other']
   *  ) satisfies Record<'odd' | 'even' | 'other', number[]> & Partial<Record<'even', number[]>>
   *    // {even: [2,4], odd: [1,3,5], other:[]}
   *    ```
   */
  groupBy<TKey extends PropertyKey, const TGroups extends PropertyKey>(
    keySelector: (next: T) => ICallbackReturn<TKey, TAsync>,
    groups: TGroups[],
  ): ReturnValue<
    Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>,
    TAsync
  >;
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: T) => ICallbackReturn<TKey, TAsync>,
    groups?: undefined,
  ): ReturnValue<Partial<Record<TKey, T[]>>, TAsync>;
}

export function groupBySync<T, TKey extends PropertyKey>(
  generator: IYieldedIterator<T>,
  keySelector: (next: T) => TKey,
  groups?: undefined,
): Partial<Record<TKey, T[]>>;
export function groupBySync<
  T,
  TKey extends PropertyKey,
  TGroups extends PropertyKey,
>(
  generator: IYieldedIterator<T>,
  keySelector: (next: T) => TKey,
  groups: TGroups[],
): Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>;
export function groupBySync(
  generator: IYieldedIterator,
  keySelector: (next: unknown) => PropertyKey,
  groups: undefined | PropertyKey[],
): Partial<Record<PropertyKey, unknown[]>> {
  const record = createInitialGroups(groups);
  for (const next of generator) {
    const key = keySelector(next);
    if (!(key in record)) {
      // @ts-expect-error
      record[key] = [];
    } // @ts-expect-error
    record[key].push(next);
  }
  return record;
}

export async function groupByAsync(
  generator: IYieldedAsyncGenerator,
  keySelector: (next: unknown) => IPromiseOrNot<PropertyKey>,
  groups: PropertyKey[] = [],
): Promise<unknown> {
  const record = createInitialGroups(groups);
  const pending = new Set<Promise<unknown>>();
  for await (const next of generator) {
    const promise = Promise.resolve(keySelector(next)).then((key) => {
      if (!(key in record)) {
        // @ts-expect-error
        record[key] = [];
      } // @ts-expect-error
      record[key].push(next);
    });
    pending.add(promise);
    void promise.then(() => {
      pending.delete(promise);
    });
  }
  await Promise.all(pending.values());
  return record;
}

function createInitialGroups(groups: undefined | PropertyKey[] = []) {
  return Object.fromEntries(groups.map((key) => [key, [] as any[]]));
}
