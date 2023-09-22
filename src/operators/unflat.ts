import { chainable } from "../chainable.ts";
import { OperatorGenerator } from "../types.ts";

export function unflat<T>(generator: OperatorGenerator<T>) {
  return () => {
    return chainable(function* (isDone) {
      const acc: T[] = [];
      for (const next of generator(isDone)) {
        if (isDone()) return;
        acc.push(next);
      }
      yield acc;
    });
  };
}
