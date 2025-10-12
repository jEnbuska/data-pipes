import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function some<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<boolean> {
  return function* someGenerator(signal) {
    for (const next of source(signal)) {
      if (predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<boolean> {
  return async function* someAsyncGenerator(signal: AbortSignal) {
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
