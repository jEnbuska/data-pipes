import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function defaultIfEmpty<T>(generator: OperatorGenerator<T>) {
  return <R = T>(defaultValue: R) =>
    chainable(function* () {
      let empty = true;
      for (const next of generator()) {
        yield next;
        empty = false;
      }
      if (empty) {
        yield defaultValue;
      }
    });
}
