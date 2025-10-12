import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

export function takeWhile<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
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

export function takeWhileAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* takeWhileAsyncGenerator(generator) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield next;
      } else {
        break;
      }
    }
  };
}
