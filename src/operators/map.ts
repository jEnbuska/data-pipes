import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function map<T>(generator: OperatorGenerator<T>) {
  return <R>(mapper: (next: T) => R) => {
    return chainable(function* () {
      for (const next of generator()) {
        yield mapper(next);
      }
    });
  };
}
