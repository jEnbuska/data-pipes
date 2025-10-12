import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function map<TInput, TOutput>(
  source: PipeSource<TInput>,
  mapper: (next: TInput) => TOutput,
): PipeSource<TOutput> {
  return function* mapGenerator(signal) {
    for (const next of source(signal)) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncPipeSource<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncPipeSource<Awaited<TOutput>> {
  return async function* mapAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      yield mapper(next);
    }
  };
}
