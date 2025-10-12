import {
  type PipeSource,
  type AsyncPipeSource,
  type GroupByGroups,
} from "../types.ts";

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
  return function* groupByGenerator(signal) {
    const record =
      groups?.reduce((acc, key) => ({ ...acc, [key]: [] }), {}) ??
      ({} satisfies Partial<Record<PropertyKey, any[]>>);
    for (const next of source(signal)) {
      const key = keySelector(next);
      if (!(key in record)) {
        record[key] = [] as any;
      }
      record[key].push(next);
    }
    yield record;
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
  return async function* groupByAsyncGenerator(signal) {
    const record =
      groups?.reduce((acc, key) => ({ ...acc, [key]: [] }), {}) ??
      ({} satisfies Partial<Record<PropertyKey, any[]>>);
    for await (const next of source(signal)) {
      const key = keySelector(next);
      if (!(key in record)) {
        record[key] = [] as any;
      }
      record[key].push(next);
    }
    yield record;
  };
}
