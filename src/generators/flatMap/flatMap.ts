import { type GeneratorMiddleware } from "../../types";

export function flatMap<Input, Output>(
  flatMapper: (next: Input) => Output | readonly Output[],
): GeneratorMiddleware<Input, Output> {
  return function* flatMapGenerator(generator) {
    for (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as Output;
      }
    }
  };
}
