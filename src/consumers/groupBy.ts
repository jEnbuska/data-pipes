import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function createInitialGroups(groups: undefined | PropertyKey[] = []) {
  return Object.fromEntries(groups.map((key) => [key, [] as any[]]));
}

export function groupBySync<T, TKey extends PropertyKey>(
  generator: YieldedIterator<T>,
  keySelector: (next: T) => TKey,
  groups?: undefined,
): Partial<Record<TKey, T[]>>;
export function groupBySync<
  T,
  TKey extends PropertyKey,
  TGroups extends PropertyKey,
>(
  generator: YieldedIterator<T>,
  keySelector: (next: T) => TKey,
  groups: TGroups[],
): Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>;
export function groupBySync(
  generator: YieldedIterator,
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
  generator: YieldedAsyncGenerator,
  keySelector: (next: unknown) => PromiseOrNot<PropertyKey>,
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
