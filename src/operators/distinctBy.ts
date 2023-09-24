import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function distinctBy<T>(generator: OperatorGenerator<T>) {
  return <R>(selector: (next: T) => R) =>
    chainable(function* () {
      const set = new Set<R>();
      for (const next of generator()) {
        const key = selector(next);
        if (set.has(key)) {
          continue;
        }
        set.add(key);
        yield next;
      }
    });
}
