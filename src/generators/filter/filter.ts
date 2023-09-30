import { type GeneratorMiddleware } from "../../types";

export function filter<Input>(
  predicate: (next: Input) => boolean,
): GeneratorMiddleware<Input> {
  return function* filterGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
      }
    }
  };
}
