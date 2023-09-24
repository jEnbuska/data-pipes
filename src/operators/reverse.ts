import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function reverse<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* () {
      const array = [...generator()];
      yield* array.reverse();
    });
}
