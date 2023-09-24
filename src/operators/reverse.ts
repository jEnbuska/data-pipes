import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function reverse<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* () {
      const array: T[] = [];
      for (const next of generator()) {
        array.unshift(next);
      }
      yield* array;
    });
}
