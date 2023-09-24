import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function reverse<T>(generator: OperatorGenerator<T>) {
  return function* () {
    yield* [...generator()].reverse();
  };
}
