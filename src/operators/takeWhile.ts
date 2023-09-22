import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function takeWhile<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* (isDone) {
      let done = false;
      for (const next of generator(() => done || isDone())) {
        if (isDone()) return;
        if (predicate(next)) {
          yield next;
        } else {
          done = true;
          break;
        }
      }
    });
}
