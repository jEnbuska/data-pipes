import {
  type GeneratorMiddleware,
  type GeneratorProvider,
  type AsyncGeneratorMiddleware,
} from "../../types.ts";

/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even')
 * ).first() // {even: [2,4], odd: [1,3]}
 */
export function groupBy<TInput, Key extends PropertyKey>(
  keySelector: (next: TInput) => Key | PropertyKey,
): GeneratorMiddleware<TInput, Partial<Record<Key, TInput[]>>>;
/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even', ["odd", "other"])
 * ).first() // {odd: [1,3], even: [2,4], other: []}
 */
export function groupBy<
  TInput,
  Key extends PropertyKey,
  Groups extends Array<Key | PropertyKey> = [],
>(
  keySelector: (next: TInput) => Key | PropertyKey,
  groups?: Groups,
): GeneratorMiddleware<
  TInput,
  Record<Groups[number], TInput[]> & Partial<Record<Key, TInput[]>>
>;
export function groupBy(
  keySelector: (next: any) => PropertyKey,
  groups?: any[],
): GeneratorMiddleware<any, Partial<Record<PropertyKey, any[]>>> {
  return function* groupByGenerator(generator: GeneratorProvider<any>) {
    const record =
      groups?.reduce((acc, key) => ({ ...acc, [key]: [] }), {}) ??
      ({} satisfies Partial<Record<PropertyKey, any[]>>);
    for (const next of generator) {
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
  Key extends PropertyKey,
  Groups extends Array<Key | PropertyKey> = [],
>(
  keySelector: (next: TInput) => Key | PropertyKey,
  groups?: Groups,
): AsyncGeneratorMiddleware<
  TInput,
  Record<Groups[number], TInput[]> & Partial<Record<Key, TInput[]>>
>;
export function groupByAsync(
  keySelector: (next: any) => PropertyKey,
  groups?: any[],
): AsyncGeneratorMiddleware<any, any> {
  return async function* groupByAsyncGenerator(generator) {
    const record =
      groups?.reduce((acc, key) => ({ ...acc, [key]: [] }), {}) ??
      ({} satisfies Partial<Record<PropertyKey, any[]>>);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!(key in record)) {
        record[key] = [] as any;
      }
      record[key].push(next);
    }
    yield record;
  };
}
