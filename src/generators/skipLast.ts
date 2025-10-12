import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function skipLast<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* skipLastGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    for (const next of source(signal)) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

export function skipLastAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* skipLastAsyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    for await (const next of source(signal)) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}
