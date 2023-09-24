import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function reduce<T>(generator: OperatorGenerator<T>) {
  return <R>(reducer: (acc: R, next: T) => R, initialValue: R) => {
    return chainable(function* () {
      let acc = initialValue;
      for (const next of generator()) {
        acc = reducer(acc, next);
      }
      yield acc;
    });
  };
}
