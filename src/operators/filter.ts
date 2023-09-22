import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function filter<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* (isDone) {
      for (const next of generator(isDone)) {
        if (isDone()) return;
        if (predicate(next)) {
          yield next;
        }
      }
    });
}
