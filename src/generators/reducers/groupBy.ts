import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

export function groupBy(
  source: StreamlessProvider<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): StreamlessProvider<any> {
  return function* groupByGenerator() {
    const record = createInitialGroups(groups);
    using generator = _internalStreamless.disposable(source);
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
  source: AsyncStreamlessProvider<any>,
  keySelector: (next: any) => PropertyKey,
  groups: PropertyKey[] = [],
): AsyncStreamlessProvider<any> {
  return async function* groupByAsyncGenerator() {
    const record = createInitialGroups(groups);
    using generator = _internalStreamless.disposable(source);
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
