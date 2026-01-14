import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBySync(
  source: SyncYieldedProvider<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): SyncYieldedProvider<any> {
  return function* groupBySyncGenerator() {
    const record = createInitialGroups(groups);
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): AsyncYieldedProvider<Awaited<any>> {
  return async function* groupByAsyncGenerator() {
    const record = createInitialGroups(groups);
    using generator = _internalYielded.disposable(source);
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
