import { type OperatorGenerator } from "../../types";

export function* flatMap<Input, Output>(
  generator: OperatorGenerator<Input>,
  callback: (next: Input) => Output | readonly Output[],
): OperatorGenerator<Output> {
  for (const next of generator) {
    const out = callback(next);
    if (Array.isArray(out)) {
      yield* out as any;
    } else {
      yield out as Output;
    }
  }
}
