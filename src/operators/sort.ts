import { type OperatorGenerator } from "./types.ts";
import { operators } from "./index.ts";
import { chainable } from "../chainable.ts";

export function sort<T>(generator: OperatorGenerator<T>) {
  return (comparator?: (a: T, b: T) => number) => {
    return chainable(function* () {
      yield* operators.toArray(generator).sort(comparator);
    });
  };
}
