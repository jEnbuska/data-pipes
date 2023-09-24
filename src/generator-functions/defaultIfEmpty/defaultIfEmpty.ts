import { type ChainableGenerator } from "../../types";

export function* defaultIfEmpty<Input, Default = Input>(
  generator: ChainableGenerator<Input>,
  defaultValue: Default,
): ChainableGenerator<Default | Input> {
  let empty = true;
  for (const next of generator) {
    yield next;
    empty = false;
  }
  if (empty) {
    yield defaultValue;
  }
}
