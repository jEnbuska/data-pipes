import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function groupBy<T>(generator: OperatorGenerator<T>) {
  return <K extends keyof unknown>(keySelector: (next: T) => K, groups?: K[]) =>
    chainable(function* (isDone) {
      const map = new Map<K, T[]>(groups?.map((key) => [key, []]));
      for (const next of generator(isDone)) {
        if (isDone()) return;
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
    });
}
