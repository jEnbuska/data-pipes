import { type OperatorGenerator } from "../../types";

export function* every<Input>(
  generator: OperatorGenerator<Input>,
  predicate: (next: Input) => boolean,
): OperatorGenerator<boolean> {
  for (const next of generator) {
    if (!predicate(next)) {
      yield false;
      return;
    }
  }
  yield true;
}
