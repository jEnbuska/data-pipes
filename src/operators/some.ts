import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function some<T>(generator: OperatorGenerator<T>) {
  return (fn: (next: T) => boolean) => {
    return chainable(function* () {
      for (const next of generator()) {
        if (fn(next)) {
          return yield true;
        }
      }
      yield false;
    });
  };
}
