import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function forEach<TInput>(
  source: PipeSource<TInput>,
  consumer: (next: TInput) => unknown,
): PipeSource<TInput> {
  return function* forEachGenerator(signal) {
    for (const next of source(signal)) {
      consumer(next);
      yield next;
    }
  };
}

export function forEachAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncPipeSource<TInput> {
  return async function* forEachAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      consumer(next);
      yield next;
    }
  };
}
