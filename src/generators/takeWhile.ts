import { type AsyncPipeSource, type PipeSource } from "../types.ts";

export function takeWhile<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<TInput> {
  return function* takeWhileAsyncGenerator(signal) {
    for (const next of source(signal)) {
      if (predicate(next)) {
        yield next;
      } else {
        break;
      }
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<TInput> {
  return async function* takeWhileAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (predicate(next)) yield next;
      else return;
    }
  };
}
