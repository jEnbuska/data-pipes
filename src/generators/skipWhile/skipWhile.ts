import { type GeneratorMiddleware } from "../../types";

export function skipWhile<Input>(
  predicate: (next: Input) => boolean,
): GeneratorMiddleware<Input> {
  return function* skipWhileGenerator(generator) {
    let skip = true;
    for (const next of generator) {
      if (skip && predicate(next)) {
        continue;
      }
      skip = false;
      yield next;
    }
  };
}
