import { type OperatorGenerator } from "../../types";

export function* takeWhile<Input>(
  generator: OperatorGenerator<Input>,
  predicate: (next: Input) => boolean,
): OperatorGenerator<Input> {
  for (const next of generator) {
    if (predicate(next)) {
      yield next;
    } else {
      break;
    }
  }
}
