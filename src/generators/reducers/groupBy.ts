import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBySync(
  provider: YieldedSyncProvider<any, any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): YieldedSyncProvider<any> {
  return function* groupBySyncGenerator(signal: AbortSignal) {
    const record = createInitialGroups(groups);
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<any, any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): YieldedAsyncProvider<Awaited<any>> {
  return async function* groupByAsyncGenerator(signal: AbortSignal) {
    const record = createInitialGroups(groups);
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
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
