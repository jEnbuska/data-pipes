import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function sort<T>(generator: OperatorGenerator<T>) {
  return (comparator?: (a: T, b: T) => number) => {
    return chainable(function* (isDone) {
      const acc: T[] = [];
      for (const next of generator(isDone)) {
        if (isDone()) return;
        acc.push(next);
      }
      yield* acc.sort(comparator);
    });
  };
}
