import { type OperatorGenerator } from "../../types.ts";

export function* every<T>(
  generator: OperatorGenerator<T>,
  predicate: (next: T) => boolean,
): OperatorGenerator<boolean> {
  for (const next of generator) {
    if (!predicate(next)) {
      yield false;
      return;
    }
  }
  yield true;
}
