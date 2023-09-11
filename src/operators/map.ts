import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function map<T>(generator: OperatorGenerator<T>) {
  return <R>(mapper: (next: T) => R) => {
    return chainable(function* (isDone) {
      for (const next of generator(isDone)) {
        if (isDone()) return;
        yield mapper(next);
      }
    });
  };
}
