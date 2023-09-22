import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function some<T>(generator: OperatorGenerator<T>) {
  return (fn: (next: T) => boolean) => {
    return chainable(function* (isDone) {
      let done = false;
      for (const next of generator(() => done || isDone())) {
        if (isDone()) return;
        if (fn(next)) {
          done = true;
          return yield true;
        }
      }
      yield false;
    });
  };
}
