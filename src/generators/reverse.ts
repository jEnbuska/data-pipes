import { type AsyncPipeSource, type PipeSource } from "../types.ts";

export function reverse<TInput>(
  source: PipeSource<TInput>,
): PipeSource<TInput> {
  return function* reverseGenerator(signal) {
    const acc: TInput[] = [];
    for (const next of source(signal)) {
      acc.unshift(next);
    }
    yield* acc;
  };
}

export function reverseAsync<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncPipeSource<TInput> {
  return async function* reverseAsyncGenerator(
    signal,
  ): AsyncGenerator<TInput, void, undefined & void> {
    const acc: TInput[] = [];
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      acc.unshift(next);
    }
    yield* acc;
  };
}
