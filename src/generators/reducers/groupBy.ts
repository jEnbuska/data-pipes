import { type YieldedProvider } from "../../types.ts";
import { $next, $return } from "../actions.ts";

function createInitialGroups(groups: any[] = []) {
  return new Map<PropertyKey, any[]>(groups?.map((key) => [key, [] as any[]]));
}

/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * @example
 * yielded([1,2,3,4,5])
 *  .groupBy(n => n % 2 ? 'odd' : 'even')
 *  .resolve() // {even: [2,4], odd: [1,3,5]}
 */
export function groupBy<In, K extends PropertyKey>(
  keySelector: (next: In) => K,
  groups?: undefined,
): YieldedProvider<In, Partial<Record<K, In[]>>>;
/**
 * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
 * Defining 'groups' argument you can ensure that all these groups are part of the result
 * @example
 * yielded([1,2,3,4,5])
 *  .groupBy(n => n % 2 ? 'odd' : 'even', ['odd', 'even', 'other'])
 *  .collect() // {even: [2,4], odd: [1,3,5], other:[]}
 */
export function groupBy<In, K extends PropertyKey, G extends PropertyKey>(
  keySelector: (next: In) => K,
  groups: G[],
): YieldedProvider<In, Record<G, In[]> & Partial<Record<Exclude<K, G>, In[]>>>;
export function groupBy(
  keySelector: (next: unknown) => PropertyKey,
  groups: PropertyKey[] = [],
): YieldedProvider<unknown, Partial<Record<PropertyKey, any[]>>> {
  const map = createInitialGroups(groups);
  return () => ({
    *onNext(next) {
      const key = keySelector(next);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(map);
    },
    *onDone() {
      const entries = Object.fromEntries(map);
      $next(entries);
      $return(entries);
    },
    onDispose() {
      map.clear();
    },
  });
}
