import { type OperatorGenerator } from "../../types";
export function* map<Input, Output>(
  generator: OperatorGenerator<Input>,
  mapper: (next: Input) => Output,
): OperatorGenerator<Output> {
  for (const next of generator) {
    yield mapper(next);
  }
}
