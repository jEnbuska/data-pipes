import { type PipeSource, type AsyncPipeSource } from "../types.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * source([{age: 5, age: 59}]).countBy((next) => next.age).first() // 64
 */
export function countBy<TInput>(
  source: PipeSource<TInput>,
  mapper: (next: TInput) => number,
): PipeSource<number> {
  return function* countByGenerator(signal) {
    let acc = 0;
    for (const next of source(signal)) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  mapper: (next: TInput) => number,
): AsyncPipeSource<number> {
  return async function* countByAsyncGenerator(signal) {
    let acc = 0;
    for await (const next of source(signal)) {
      acc += mapper(next);
    }
    yield acc;
  };
}
