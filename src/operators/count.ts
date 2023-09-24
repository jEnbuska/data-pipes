import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function count<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* () {
      let count = 0;
      for (const _ of generator()) {
        count++;
      }
      yield count;
    });
}
