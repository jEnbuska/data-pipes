import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

export function skipWhile<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
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
export function skipWhileAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* skipWhileAsyncGenerator(generator) {
    let skip = true;
    for await (const next of generator) {
      if (skip && predicate(next)) {
        continue;
      }
      skip = false;
      yield next;
    }
  };
}
