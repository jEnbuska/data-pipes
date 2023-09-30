import { type GeneratorProvider } from "../../types";

export function defaultIfEmpty<Default, ImperativeInput = never>(
  defaultValue: Default,
) {
  return function* defaultIfEmptyGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ) {
    let empty = true;
    for (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield defaultValue;
    }
  };
}
