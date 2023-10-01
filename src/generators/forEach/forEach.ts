import { type GeneratorMiddleware } from "../../types";

/**
 * Calls the provided consumer function for each item produced by the generator and yields it
 * to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  forEach(n => console.log(n)) // 1, 2, 3
 * ).consume();
 * */
export function forEach<Input>(
  consumer: (next: Input) => unknown,
): GeneratorMiddleware<Input> {
  return function* forEachGenerator(generator) {
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
