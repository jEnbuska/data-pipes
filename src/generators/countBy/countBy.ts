import {
  type GeneratorProvider,
  type AsyncGeneratorMiddleware,
} from "../../types.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * pipe(
 *  [{age: 5, age: 59}],
 *  countBy((next) => next.age)
 * ).first() // 64
 */
export function countBy<TInput>(mapper: (next: TInput) => number) {
  return function* countByGenerator(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<number> {
    let acc = 0;
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  mapper: (next: TInput) => number,
): AsyncGeneratorMiddleware<TInput, number> {
  return async function* countByAsyncGenerator(generator) {
    let acc = 0;
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
