import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

export function flatMap<TInput, TOutput>(
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): GeneratorMiddleware<TInput, TOutput> {
  return function* flatMapGenerator(generator) {
    for (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}

export function flatMapAsync<TInput, TOutput>(
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncGeneratorMiddleware<TInput, TOutput> {
  return async function* flatMapAsyncGenerator(generator) {
    for await (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}
