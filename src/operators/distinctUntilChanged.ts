import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function distinctUntilChanged<T>(generator: OperatorGenerator<T>) {
  return (comparator?: (previous: T, current: T) => boolean) => {
    return chainable(function* () {
      let first = true;
      let previous: T;
      for (const current of generator()) {
        if (first || comparator(previous, current)) {
          previous = current;
          yield current;
          first = false;
        }
      }
    });
  };
}
