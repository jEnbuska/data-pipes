import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

/**
 * Calls the provided consumer function for each item produced by the generator and yields it
 * to the next operation.
 * @example
 * source([1,2,3]).forEach(n => console.log(n)).consume();
 * */
export function forEach<TInput>(
  consumer: (next: TInput) => unknown,
): GeneratorMiddleware<TInput> {
  return function* forEachGenerator(generator) {
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function forEachAsync<TInput>(
  consumer: (next: TInput) => unknown,
): AsyncGeneratorMiddleware<TInput> {
  return async function* forEachAsyncGenerator(generator) {
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
