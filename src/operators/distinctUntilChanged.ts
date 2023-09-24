import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

const defaultCompare = <T>(a: T, b: T) => a === b;
export function distinctUntilChanged<T>(generator: OperatorGenerator<T>) {
  return (compare: (previous: T, current: T) => boolean = defaultCompare) => {
    return chainable(function* () {
      let first = true;
      let previous: T;
      for (const current of generator()) {
        if (first || compare(previous!, current)) {
          previous = current;
          yield current;
          first = false;
        }
      }
    });
  };
}
