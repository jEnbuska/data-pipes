import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function find<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<TInput> {
  return function* findGenerator(signal) {
    for (const next of source(signal)) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}

export function findAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<TInput> {
  return async function* findAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}
