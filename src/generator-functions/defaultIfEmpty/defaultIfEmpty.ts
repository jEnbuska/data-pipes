import { type OperatorGenerator } from "../../types";

export function* defaultIfEmpty<Input, Default = Input>(
  generator: OperatorGenerator<Input>,
  defaultValue: Default,
): OperatorGenerator<Default | Input> {
  let empty = true;
  for (const next of generator) {
    yield next;
    empty = false;
  }
  if (empty) {
    yield defaultValue;
  }
}
