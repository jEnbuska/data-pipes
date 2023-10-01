import { type GeneratorMiddleware } from "../../types";

/**
 * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
 * @example
 * pipe(
 *  [1,2,3,4],
 *  find(n => n > 2)
 * ).toArray() // [3]
 */
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
