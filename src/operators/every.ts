import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function every<T>(
  generator: OperatorGenerator<T>,
  predicate: (next: T) => boolean,
) {
  return function* () {
    for (const next of generator()) {
      if (!predicate(next)) {
        yield false;
        return;
      }
    }
    yield true;
  };
}
