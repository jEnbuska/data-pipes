import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function skipWhile<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* () {
      let skip = true;
      for (const next of generator()) {
        if (skip && predicate(next)) {
          continue;
        }
        skip = false;
        yield next;
      }
    });
}
