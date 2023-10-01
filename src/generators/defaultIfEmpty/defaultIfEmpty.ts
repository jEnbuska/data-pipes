import { type GeneratorProvider } from "../../types";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * pipe(
 *  [1,2,3],
 *  filter(it => it > 3)
 *  defaultIfEmpty(0)
 * ).first() // 0
 */
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
