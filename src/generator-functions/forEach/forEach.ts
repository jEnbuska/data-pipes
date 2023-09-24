import { type ChainableGenerator } from "../../types";

export function* forEach<Input>(
  generator: ChainableGenerator<Input>,
  consumer: (next: Input) => unknown,
) {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}
