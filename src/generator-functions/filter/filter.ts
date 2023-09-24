import { type ChainableGenerator } from "../../types";

export function* filter<Input>(
  generator: ChainableGenerator<Input>,
  predicate: (next: Input) => boolean,
): ChainableGenerator<Input> {
  for (const next of generator) {
    if (predicate(next)) {
      yield next;
    }
  }
}
