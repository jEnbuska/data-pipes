import { type OperatorGenerator } from "../../types";

export function* skipWhile<Input>(
  generator: OperatorGenerator<Input>,
  predicate: (next: Input) => boolean,
): OperatorGenerator<Input> {
  let skip = true;
  for (const next of generator) {
    if (skip && predicate(next)) {
      continue;
    }
    skip = false;
    yield next;
  }
}
