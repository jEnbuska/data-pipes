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
 *
 * If the groups parameter is provided, only the groups specified will be collected.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even', ["odd"])
 * ).first() // {odd: [1,3]}
 */
export function groupBy<Input, Groups extends PropertyKey, Key extends Groups>(
  keySelector: (next: Input) => Key | PropertyKey,
  groups: Groups[],
): GeneratorMiddleware<Input, Record<Groups, Input[]>>;

/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.

 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even')
 * ).first() // {even: [2,4], odd: [1,3]}
 *
 * If the groups parameter is provided, only the groups specified will be collected.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  groupBy(n => n % 2 ? 'odd' : 'even', ["odd"])
 * ).first() // {odd: [1,3]}
 */
export function groupBy<Input, Key extends PropertyKey>(
  keySelector: (next: Input) => Key,
): GeneratorMiddleware<Input, Partial<Record<Key, Input[]>>>;
export function groupBy(
  keySelector: (next: unknown) => PropertyKey,
  groups?: PropertyKey[],
) {
  return function* groupByGenerator(generator: GeneratorProvider<unknown>) {
    const map = new Map<PropertyKey, unknown[]>(
      groups?.map((key) => [key, []]),
    );
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(key)) {
        if (groups) {
          continue;
        }
        map.set(key, []);
      }
      map.get(key)?.push(next);
    }
    yield Object.fromEntries(map.entries());
  };
}
