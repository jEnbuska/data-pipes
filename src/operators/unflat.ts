import { type OperatorGenerator } from "./types.ts";
import { reduce } from "./reduce.ts";
import { chainable } from "../chainable.ts";

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
