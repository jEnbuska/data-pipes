import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function forEach<T>(generator: OperatorGenerator<T>) {
  return (consumer: (next: T) => unknown) => {
    return chainable(function* () {
      for (const next of generator()) {
        consumer(next);
        yield next;
      }
    });
  };
}
