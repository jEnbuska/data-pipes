import { type ChainableGenerator } from "../../types";

export function* groupBy<Input, Key extends PropertyKey>(
  generator: ChainableGenerator<Input>,
  keySelector: (next: Input) => Key,
  groups?: Key[],
) {
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
}
