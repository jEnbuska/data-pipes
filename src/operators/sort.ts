import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function sort<T>(generator: OperatorGenerator<T>) {
  return (comparator?: (a: T, b: T) => number) => {
    return chainable(function* () {
      yield* [...generator()].sort(comparator);
    });
  };
}
