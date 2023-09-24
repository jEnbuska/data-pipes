import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function takeWhile<T>(generator: OperatorGenerator<T>) {
  return (predicate: (next: T) => boolean) =>
    chainable(function* () {
      for (const next of generator()) {
        if (predicate(next)) {
          yield next;
        } else {
          break;
        }
      }
    });
}
