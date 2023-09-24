import { type OperatorGenerator } from "../../types";

export function* forEach<Input>(
  generator: OperatorGenerator<Input>,
  consumer: (next: Input) => unknown,
) {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}
