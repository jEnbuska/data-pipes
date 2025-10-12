import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function skipWhile<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<TInput> {
  return function* skipWhileGenerator(signal) {
    let skip = true;
    for (const next of source(signal)) {
      if (skip && predicate(next)) {
        continue;
      }
      skip = false;
      yield next;
    }
  };
}
export function skipWhileAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<TInput> {
  return async function* skipWhileAsyncGenerator(signal) {
    let skip = true;
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
