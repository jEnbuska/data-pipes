import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function count<T>(generator: OperatorGenerator<T>) {
  return () =>
    chainable(function* (isDone) {
      let count = 0;
      for (const _ of generator(isDone)) {
        if (isDone()) return;
        count++;
      }
      yield count;
    });
}
