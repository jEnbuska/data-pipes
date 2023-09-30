import { type GeneratorMiddleware } from "../../types.ts";

export function groupBy<Input, Key extends PropertyKey>(
  keySelector: (next: Input) => Key,
  groups?: Key[],
): GeneratorMiddleware<Input, Partial<Record<Key, Input[]>>> {
  return function* groupByGenerator(generator) {
    const map = new Map<Key, Input[]>(groups?.map((key) => [key, []]));
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
    yield Object.fromEntries(map.entries()) as Partial<Record<Key, Input[]>>;
  };
}
