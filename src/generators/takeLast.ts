import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function takeLast<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* takeLastGenerator(signal) {
    const array = [...source(signal)];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}

export function takeLastAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* takeLastAsyncGenerator(signal) {
    const acc: TInput[] = [];
    for await (const next of source(signal)) {
      if (signal.aborted) break;
      acc.push(next);
    }
    yield* acc.slice(Math.max(acc.length - count, 0));
  };
}
