import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function distinctBy<T>(generator: OperatorGenerator<T>) {
  return <R>(selector: (next: T) => R) =>
    chainable(function* (isDone) {
      const set = new Set<R>();
      for (const next of generator(isDone)) {
        if (isDone()) return;
        const key = selector(next);
        if (set.has(key)) {
          continue;
        }
        set.add(key);
        yield next;
      }
    });
}
