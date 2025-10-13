import {
  type PipeSource,
  type AsyncPipeSource,
  type GroupByGroups,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

function createInitialRecord(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, []]));
}

export function groupBy<
  TInput,
  TKey extends PropertyKey,
  TGroups extends undefined | GroupByGroups<TKey>,
>(
  source: PipeSource<TInput>,
  keySelector: (next: TInput) => PropertyKey | TKey,
  groups: TGroups,
): PipeSource<
  TGroups extends GroupByGroups<TKey>
    ? Record<TGroups[number], TInput[]> & Partial<Record<TKey, TInput[]>>
    : Partial<Record<TKey, TInput[]>>
>;
export function groupBy(
  source: PipeSource<any>,
  keySelector: (TInput: any) => PropertyKey,
  groups: any[] | undefined,
): PipeSource<any> {
  return function* groupByGenerator() {
    const record = new Map<PropertyKey, any[]>(
      groups?.map((key) => [key, []]) ?? [],
    );
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

export function groupByAsync<
  TInput,
  TKey extends PropertyKey,
  TGroups extends undefined | GroupByGroups<TKey>,
>(
  source: AsyncPipeSource<TInput>,
  keySelector: (next: TInput) => PropertyKey,
  groups: TGroups,
): AsyncPipeSource<
  TGroups extends GroupByGroups<TKey>
    ? Record<TGroups[number], TInput[]> & Partial<Record<TKey, TInput[]>>
    : Partial<Record<TKey, TInput[]>>
>;
export function groupByAsync(
  source: AsyncPipeSource<any>,
  keySelector: (next: any) => PropertyKey,
  groups?: any[],
): AsyncPipeSource<Partial<Record<PropertyKey, any[]>>> {
  return async function* groupByAsyncGenerator() {
    const record = createInitialRecord(groups);
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
