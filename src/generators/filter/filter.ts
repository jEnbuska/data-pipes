import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../../types";

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
export function filter<TInput, TOutput extends TInput = TInput>(
  predicate: (next: TInput) => next is TOutput,
): GeneratorMiddleware<TInput, TOutput>;
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
export function filter<TInput>(
  predicate: (next: TInput) => unknown,
): GeneratorMiddleware<TInput>;
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

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  predicate: (next: TInput) => next is TOutput,
): AsyncGeneratorMiddleware<TInput, TOutput>;
export function filterAsync<TInput, TOutput extends TInput = TInput>(
  predicate: (next: TInput) => next is TOutput,
): AsyncGeneratorMiddleware<TInput, TOutput>;
export function filterAsync(
  predicate: (next: unknown) => any,
): AsyncGeneratorMiddleware<unknown, unknown> {
  return async function* filterAsyncGenerator(generator) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield next;
      }
    }
  };
}
