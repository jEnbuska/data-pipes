import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function filter<TInput, TOutput extends TInput = TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => next is TOutput,
): PipeSource<TOutput>;
export function filter<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => any,
): PipeSource<TInput>;
export function filter(
  source: PipeSource<unknown>,
  predicate: (next: unknown) => unknown,
): PipeSource<unknown> {
  return function* filterGenerator(signal) {
    for (const next of source(signal)) {
      if (predicate(next)) {
        yield next;
      }
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncPipeSource<TOutput>;
export function filterAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => any,
): AsyncPipeSource<TInput>;
export function filterAsync(
  source: AsyncPipeSource<unknown>,
  predicate: (next: unknown) => any,
): AsyncPipeSource<unknown> {
  return async function* filterAsyncGenerator(signal) {
    if (signal.aborted) return;
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      if (predicate(next)) yield next;
    }
  };
}
