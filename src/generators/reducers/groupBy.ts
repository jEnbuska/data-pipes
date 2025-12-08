import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBy(
  source: ProviderFunction<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): ProviderFunction<any> {
  return function* groupByGenerator() {
    const record = createInitialGroups(groups);
    using generator = disposable(source);
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

export function groupByAsync(
  source: AsyncProviderFunction<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): AsyncProviderFunction<any> {
  return async function* groupByAsyncGenerator() {
    const record = createInitialGroups(groups);
    using generator = disposable(source);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!record.has(key)) {
        record.set(key, []);
      }
      record.get(key)!.push(next);
    }
    yield Object.fromEntries(record);
  };
}
