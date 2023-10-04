import {
  type GeneratorMiddleware,
  type GeneratorProvider,
} from "../../types.ts";

/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even')
 * ).first() // {even: [2,4], odd: [1,3]}
 */
export function groupBy<Input, Key extends PropertyKey>(
  keySelector: (next: Input) => Key | PropertyKey,
): GeneratorMiddleware<Input, Partial<Record<Key, Input[]>>>;
/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even', ["odd", "other"])
 * ).first() // {odd: [1,3], even: [2,4], other: []}
 */
export function groupBy<
  Input,
  Key extends PropertyKey,
  Groups extends Array<Key | PropertyKey> = [],
>(
  keySelector: (next: Input) => Key | PropertyKey,
  groups?: Groups,
): GeneratorMiddleware<
  Input,
  Record<Groups[number], Input[]> & Partial<Record<Key, Input[]>>
>;
export function groupBy(
  keySelector: (next: any) => PropertyKey,
  groups?: any[],
): GeneratorMiddleware<any, Partial<Record<PropertyKey, any[]>>> {
  return function* groupByGenerator(generator: GeneratorProvider<any>) {
    const map =
      groups?.reduce((acc, key) => ({ ...acc, [key]: [] }), {}) ??
      ({} as Partial<Record<PropertyKey, any[]>>);
    for (const next of generator) {
      const key = keySelector(next);
      if (!(key in map)) {
        map[key] = [] as any;
      }
      map[key].push(next);
    }
    yield map;
  };
}
