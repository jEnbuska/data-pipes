import { type OperatorGenerator } from "../../types.ts";

export function* skipWhile<T>(
  generator: OperatorGenerator<T>,
  predicate: (next: T) => boolean,
): OperatorGenerator<T> {
  let skip = true;
  for (const next of generator) {
    if (skip && predicate(next)) {
      continue;
    }
    skip = false;
    yield next;
  }
}
