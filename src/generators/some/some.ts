import { type GeneratorProvider } from "../../types";

/**
 * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
 * if the generator is empty yields false
 *
 * @example
 * pipe(
 *  [1,2,3,4],
 *  some(n => n > 2)
 * ).first() // true
 */
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
