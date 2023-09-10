import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function flatMap<T>(generator: OperatorGenerator<T>) {
  return <R>(callback: (next: T) => R | readonly R[]) =>
    chainable(function* () {
      for (const next of generator()) {
        const out = callback(next);
        if (Array.isArray(out)) {
          yield* out;
          continue;
        }
        yield out;
      }
    });
}
