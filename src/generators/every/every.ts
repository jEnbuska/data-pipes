import { type GeneratorMiddleware } from "../../types";

export function every<Input>(
  predicate: (next: Input) => boolean,
): GeneratorMiddleware<Input, boolean> {
  return function* everyGenerator(generator) {
    for (const next of generator) {
      if (!predicate(next)) {
        yield false;
        return;
      }
    }
    yield true;
  };
}
