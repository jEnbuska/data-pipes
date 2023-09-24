import { type OperatorGenerator } from "../../types.ts";

export function* groupBy<T, K extends PropertyKey>(
  generator: OperatorGenerator<T>,
  keySelector: (next: T) => K,
  groups?: K[],
) {
  const map = new Map<K, T[]>(groups?.map((key) => [key, []]));
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
  yield Object.fromEntries(map.entries()) as Partial<Record<K, T[]>>;
}
