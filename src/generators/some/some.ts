import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types";

/**
 * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
 * if the generator is empty yields false
 *
 * @example
 * pipe(
 *  [1,2,3,4],
 *  some(n => n > 2)
 * ).first() // true
 */
export function some<TInput>(predicate: (next: TInput) => boolean) {
  return function* someGenerator(generator: GeneratorProvider<TInput>) {
    for (const next of generator) {
      if (predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}
export function someAsync<TInput>(predicate: (next: TInput) => boolean) {
  return async function* someAsyncGenerator(
    generator: AsyncGeneratorProvider<TInput>,
  ) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}
