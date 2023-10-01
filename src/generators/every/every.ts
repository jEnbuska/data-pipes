import { type GeneratorMiddleware } from "../../types";

/**
 * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
 * if the generator is empty yields true
 *
 * @example
 * pipe(
 *  [1,2,3,4],
 *  every(n => n > 1)
 * ).first() // false
 */
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
