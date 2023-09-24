import { type OperatorGenerator } from "../../types.ts";

export function* reduce<T, R>(
  generator: OperatorGenerator<T>,
  reducer: (acc: R, next: T) => R,
  initialValue: R,
) {
  let acc = initialValue;
  for (const next of generator) {
    acc = reducer(acc, next);
  }
  yield acc;
}
