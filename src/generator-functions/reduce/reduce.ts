import { type OperatorGenerator } from "../../types";

export function* reduce<Input, Output>(
  generator: OperatorGenerator<Input>,
  reducer: (acc: Output, next: Input) => Output,
  initialValue: Output,
) {
  let acc = initialValue;
  for (const next of generator) {
    acc = reducer(acc, next);
  }
  yield acc;
}
