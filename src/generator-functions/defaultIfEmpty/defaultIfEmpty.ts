import { type OperatorGenerator } from "../../types.ts";

export function* defaultIfEmpty<T, R = T>(
  generator: OperatorGenerator<T>,
  defaultValue: R,
): OperatorGenerator<R | T> {
  let empty = true;
  for (const next of generator) {
    yield next;
    empty = false;
  }
  if (empty) {
    yield defaultValue;
  }
}
