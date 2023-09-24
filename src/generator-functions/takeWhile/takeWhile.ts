import { type OperatorGenerator } from "../../types.ts";

export function* takeWhile<T>(
  generator: OperatorGenerator<T>,
  predicate: (next: T) => boolean,
): OperatorGenerator<T> {
  for (const next of generator) {
    if (predicate(next)) {
      yield next;
    } else {
      break;
    }
  }
}
