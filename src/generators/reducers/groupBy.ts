import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBySync<TArgs extends any[], TIn, TKey extends PropertyKey>(
  keySelector: (next: TIn) => TKey,
): SyncOperatorResolver<TArgs, TIn, Partial<Record<TKey, TIn[]>>>;
export function groupBySync<
  TArgs extends any[],
  TIn,
  TKey extends PropertyKey,
  const TGroups extends PropertyKey,
>(
  keySelector: (next: TIn) => TKey,
  groups: TGroups[],
): SyncOperatorResolver<
  TArgs,
  TIn,
  Record<TGroups, TIn[]> & Partial<Record<Exclude<TKey, TGroups>, TIn[]>>
>;
export function groupBySync<TArgs extends any[], TIn>(
  keySelector: (next: TIn) => PropertyKey,
  groups: PropertyKey[] = [],
): SyncOperatorResolver<TArgs, TIn, Partial<Record<PropertyKey, TIn[]>>> {
  return function* groupBySyncResolver(...args) {
    using generator = startGenerator(...args);
    const record = createInitialGroups(groups);
    for (const next of generator) {
      const key = keySelector(next);
      if (!record.has(key)) {
        record.set(key, []);
      }
      record.get(key)!.push(next);
    }
    yield Object.fromEntries(record);
  };
}
export function groupByAsync<
  TArgs extends any[],
  TIn,
  TKey extends PropertyKey,
>(
  keySelector: (next: TIn) => TKey | Promise<TKey>,
): AsyncOperatorResolver<TArgs, TIn, Partial<Record<TKey, TIn[]>>>;
export function groupByAsync<
  TArgs extends any[],
  TIn,
  TKey extends PropertyKey,
  const TGroups extends PropertyKey,
>(
  keySelector: (next: TIn) => TKey | Promise<TKey>,
  groups: TGroups[],
): AsyncOperatorResolver<
  TArgs,
  TIn,
  Record<TGroups, TIn[]> & Partial<Record<Exclude<TKey, TGroups>, TIn[]>>
>;
export function groupByAsync<TArgs extends any[], TIn>(
  keySelector: (next: TIn) => PropertyKey | Promise<PropertyKey>,
  groups: PropertyKey[] = [],
): AsyncOperatorResolver<TArgs, TIn, Partial<Record<PropertyKey, TIn[]>>> {
  return async function* groupByAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const record = createInitialGroups(groups);
    for await (const next of generator) {
      const key = await keySelector(next);
      if (!record.has(key)) {
        record.set(key, []);
      }
      record.get(key)!.push(next);
    }
    yield Object.fromEntries(record);
  };
}

export default defineOperator({
  name: "groupBy",
  groupByAsync,
  groupBySync,
});
