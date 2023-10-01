import { type GeneratorMiddleware } from "../../types";

/**
 * Filters items produced by the generator using the provided predicate
 * and yields the items that pass the predicate to the next operation.
 *
 * @example
 * pipe(
 *   [1,2,3, "A"],
 *   filter((n): n is number => typeof n === "number")
 * ).toArray() // [1,2,3];
 */
export function filter<Input, Output extends Input = Input>(
  predicate: (next: Input) => next is Output,
): GeneratorMiddleware<Input, Output>;
/**
 * Filters items produced by the generator using the provided predicate
 * and yields the items that pass the predicate to the next operation.
 *
 * @example
 * pipe(
 *   [1,2,3],
 *   filter((n) => n % 2)
 * ).toArray() // [1,3];
 */
export function filter<Input>(
  predicate: (next: Input) => unknown,
): GeneratorMiddleware<Input>;
export function filter(
  predicate: (next: unknown) => any,
): GeneratorMiddleware<unknown, unknown> {
  return function* filterGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
      }
    }
  };
}
