import { type GeneratorMiddleware } from "../../types";

export function find<Input>(
  predicate: (next: Input) => boolean,
): GeneratorMiddleware<Input> {
  return function* findGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}
