import { type ChainableGenerator } from "../../types";

export function* flatMap<Input, Output>(
  generator: ChainableGenerator<Input>,
  callback: (next: Input) => Output | readonly Output[],
): ChainableGenerator<Output> {
  for (const next of generator) {
    const out = callback(next);
    if (Array.isArray(out)) {
      yield* out as any;
    } else {
      yield out as Output;
    }
  }
}
