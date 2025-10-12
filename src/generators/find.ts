import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

export function find<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
  return function* findGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}

export function findAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* findAsyncGenerator(generator) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}
