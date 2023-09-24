import { type OperatorGenerator } from "../../types";

export function* some<Input>(
  generator: OperatorGenerator<Input>,
  fn: (next: Input) => boolean,
) {
  for (const next of generator) {
    if (fn(next)) {
      yield true;
      return;
    }
  }
  yield false;
}
