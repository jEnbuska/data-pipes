import { type GeneratorMiddleware } from "../../types";

export function flatMap<Input, Output>(
  callback: (next: Input) => Output | readonly Output[],
): GeneratorMiddleware<Input, Output> {
  return function* flatMapGenerator(generator) {
    for (const next of generator) {
      const out = callback(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as Output;
      }
    }
  };
}
