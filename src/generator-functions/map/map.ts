import { type OperatorGenerator } from "../../types";
export function* map<T, R>(
  generator: OperatorGenerator<T>,
  mapper: (next: T) => R,
): OperatorGenerator<R> {
  for (const next of generator) {
    yield mapper(next);
  }
}
