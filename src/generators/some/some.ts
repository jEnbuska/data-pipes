import { type GeneratorProvider } from "../../types";

export function some<Input>(predicate: (next: Input) => boolean) {
  return function* someGenerator(generator: GeneratorProvider<Input>) {
    for (const next of generator) {
      if (predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}
