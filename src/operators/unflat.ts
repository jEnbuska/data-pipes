import { chainable } from "../chainable.ts";
import { OperatorGenerator } from "../types.ts";

export function unflat<T>(generator: OperatorGenerator<T>) {
  return () => {
    return chainable(function* () {
      const array = [...generator()];
      yield array;
    });
  };
}
