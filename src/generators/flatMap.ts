import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function flatMap<TInput, TOutput>(
  source: PipeSource<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): PipeSource<TOutput> {
  return function* flatMapGenerator(signal) {
    for (const next of source(signal)) {
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
  source: AsyncPipeSource<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncPipeSource<Awaited<TOutput>> {
  return async function* flatMapAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}
