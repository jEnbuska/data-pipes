import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBy(
  source: PipeSource<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): PipeSource<any> {
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
  source: AsyncPipeSource<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): AsyncPipeSource<any> {
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
