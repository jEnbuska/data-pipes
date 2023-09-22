import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

const defaultCompare = <T>(a: T, b: T) => a === b;
export function distinctUntilChanged<T>(generator: OperatorGenerator<T>) {
  return (compare: (previous: T, current: T) => boolean = defaultCompare) => {
    return chainable(function* (isDone) {
      let first = true;
      let previous: T;
      for (const current of generator(isDone)) {
        if (isDone()) return;
        if (first || compare(previous!, current)) {
          previous = current;
          yield current;
          first = false;
        }
      }
    });
  };
}
