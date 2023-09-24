import { chainable } from "../chainable.ts";
import { OperatorGenerator } from "../types.ts";

export function unflat<T>(generator: OperatorGenerator<T>) {
  return () => {
    return chainable(function* () {
      const acc: T[] = [];
      for (const next of generator()) {
        acc.push(next);
      }
      yield acc;
    });
  };
}
