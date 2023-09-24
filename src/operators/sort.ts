import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function sort<T>(generator: OperatorGenerator<T>) {
  return (comparator?: (a: T, b: T) => number) => {
    return chainable(function* () {
      const acc: T[] = [];
      for (const next of generator()) {
        acc.push(next);
      }
      yield* acc.sort(comparator);
    });
  };
}
