import {
  type AsyncGeneratorMiddlewareReturn,
  type PipeSource,
  type AsyncPipeSource,
} from "../types.ts";

export function take<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* takeGenerator(signal: AbortSignal) {
    if (count <= 0) {
      return;
    }
    for (const next of source(signal)) {
      yield next;
      if (!--count) {
        break;
      }
    }
  };
}

export function takeAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* takeAsyncGenerator(
    signal: AbortSignal,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    if (count <= 0) {
      return;
    }
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      yield next;
      if (!--count) {
        break;
      }
    }
  };
}
