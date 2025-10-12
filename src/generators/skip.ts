import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function skip<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* skipGenerator(signal) {
    let skipped = 0;
    for (const next of source(signal)) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* skipAsyncGenerator(signal) {
    let skipped = 0;
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
