import { type ChainableGenerator } from "../../types";
export function* map<Input, Output>(
  generator: ChainableGenerator<Input>,
  mapper: (next: Input) => Output,
): ChainableGenerator<Output> {
  for (const next of generator) {
    yield mapper(next);
  }
}
