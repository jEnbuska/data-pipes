import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export const filter =
  <T>(generator: OperatorGenerator<T>) => (predicate: (next: T) => boolean) =>
    chainable(function* () {
      for (const next of generator()) {
        if (predicate(next)) {
          yield next;
        }
      }
    });
