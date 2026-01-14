import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBySync(
  source: SyncYieldedProvider<any, any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): SyncYieldedProvider<any> {
  return function* groupBySyncGenerator(signal: AbortSignal) {
    const record = createInitialGroups(groups);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableGenerator(source, signal);
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
  source: AsyncYieldedProvider<any, any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): AsyncYieldedProvider<Awaited<any>> {
  return async function* groupByAsyncGenerator(signal: AbortSignal) {
    const record = createInitialGroups(groups);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
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
