import { type OperatorGenerator } from "../../types.ts";

export function* some<T>(
  generator: OperatorGenerator<T>,
  fn: (next: T) => boolean,
) {
  for (const next of generator) {
    if (fn(next)) {
      yield true;
      return;
    }
  }
  yield false;
}
