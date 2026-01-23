import type {
  YieldedAsyncProvider,
  YieldedSyncMiddleware,
  YieldedSyncProvider,
} from "../types.ts";

export function createInitialGroups(groups: any[] = []) {
  return Object.fromEntries(groups?.map((key) => [key, [] as any[]]));
}

export function groupBySync(
  invoke: YieldedSyncProvider,
  keySelector: (next: unknown) => PropertyKey,
  groups: PropertyKey[] = [],
): YieldedSyncMiddleware<unknown, unknown> {
  const record = createInitialGroups(groups);
  const generator = invoke();
  for (const next of generator) {
    const key = keySelector(next);
    if (!(key in record)) {
      record[key] = [];
    }
    record[key].push(next);
  }
  return record;
}

export async function groupByAsync(
  invoke: YieldedAsyncProvider,
  keySelector: (next: unknown) => Promise<PropertyKey> | PropertyKey,
  groups: PropertyKey[] = [],
): Promise<unknown> {
  const record = createInitialGroups(groups);
  const pending = new Set<Promise<unknown>>();
  for await (const next of invoke()) {
    const promise = Promise.resolve(keySelector(next)).then((key) => {
      if (!(key in record)) {
        record[key] = [];
      }
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
