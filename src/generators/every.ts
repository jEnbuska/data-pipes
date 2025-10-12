import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function every<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<boolean> {
  return function* everyGenerator(signal) {
    for (const next of source(signal)) {
      if (!predicate(next)) {
        yield false;
        return;
      }
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<boolean> {
  return async function* everyAsyncGenerator(signal) {
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
