import { type GeneratorProvider, type GeneratorMiddleware } from "../../types";

export function takeWhile<Input>(
  predicate: (next: Input) => boolean,
): GeneratorMiddleware<Input> {
  return function* takeWhileGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
      } else {
        break;
      }
    }
  };
}
