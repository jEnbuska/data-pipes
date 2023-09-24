import { type ChainableGenerator } from "../../types";

export function* every<Input>(
  generator: ChainableGenerator<Input>,
  predicate: (next: Input) => boolean,
): ChainableGenerator<boolean> {
  for (const next of generator) {
    if (!predicate(next)) {
      yield false;
      return;
    }
  }
  yield true;
}
