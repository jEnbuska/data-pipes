import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function find<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* (isDone) {
      let done = false;
      for (const next of generator(() => done || isDone())) {
        if (isDone()) return;
        if (predicate(next)) {
          done = true;
          yield next;
          break;
        }
      }
    });
}
