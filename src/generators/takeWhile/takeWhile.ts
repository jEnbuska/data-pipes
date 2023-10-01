import { type GeneratorMiddleware } from "../../types";

/**
 * takes items produced by the generator while the predicate returns true and yields them to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  takeWhile(n => n < 3)
 * ).toArray() // [1,2]
 */
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
