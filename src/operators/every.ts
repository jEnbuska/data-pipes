import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function every<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* (isDone) {
      let done = false;
      for (const next of generator(() => done || isDone())) {
        if (isDone()) return;
        if (!predicate(next)) {
          done = true;
          return yield false;
        }
      }
      yield true;
    });
}
