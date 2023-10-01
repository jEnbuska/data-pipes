import { type GeneratorMiddleware } from "../../types";

/**
 * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  skipWhile(n => n < 3)
 * ).toArray() // [3,4]
 * */
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
