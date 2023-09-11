import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function reverse<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* (isDone) {
      const array: T[] = [];
      for (const next of generator(isDone)) {
        if (isDone()) return;
        array.unshift(next);
      }
      yield* array;
    });
}
