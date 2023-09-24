import { type ChainableGenerator } from "../../types";

export function* skipWhile<Input>(
  generator: ChainableGenerator<Input>,
  predicate: (next: Input) => boolean,
): ChainableGenerator<Input> {
  let skip = true;
  for (const next of generator) {
    if (skip && predicate(next)) {
      continue;
    }
    skip = false;
    yield next;
  }
}
