import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function count<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* () {
      yield [...generator()].length;
    });
}
