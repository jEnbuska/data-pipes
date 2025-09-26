import type {
  GeneratorMiddleware,
  AsyncGeneratorMiddleware,
} from "../types.ts";

export function batch<TInput>(
  predicate: (acc: TInput[]) => boolean,
): GeneratorMiddleware<TInput, TInput[]> {
  return function* batchGenerator(generator) {
    let acc: TInput[] = [];
    for (const next of generator) {
      acc.push(next);
      if (predicate(acc)) {
        continue;
      }
      yield acc;
      acc = [];
    }
    if (acc.length) {
      yield acc;
    }
  };
}

export function batchAsync<TInput>(
  predicate: (batch: TInput[]) => boolean,
): AsyncGeneratorMiddleware<TInput, TInput[]> {
  return async function* batchGenerator(generator) {
    let acc: TInput[] = [];
    for await (const next of generator) {
      acc.push(next);
      if (predicate(acc)) {
        continue;
      }
      yield acc;
      acc = [];
    }
    if (acc.length) {
      yield acc;
    }
  };
}
