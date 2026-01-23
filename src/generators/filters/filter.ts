import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  predicate: (next: TInput) => next is TOutput,
): YieldedSyncMiddleware<TOutput>;
export function filterSync<TInput>(
  predicate: (next: TInput) => any,
): YieldedSyncMiddleware<TInput>;
export function filterSync(
  predicate: (next: unknown) => unknown,
): YieldedSyncMiddleware<any, any> {
  return function* filterSyncResolver(generator) {
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  predicate: (next: TInput) => next is TOutput,
): YieldedAsyncMiddleware<Awaited<TOutput>>;
export function filterAsync<TInput>(
  predicate: (next: TInput) => any,
): YieldedAsyncMiddleware<Awaited<TInput>>;
export function filterAsync(
  predicate: (next: unknown) => any,
): YieldedAsyncMiddleware<any, any> {
  return async function* filterAsyncResolver(generator) {
    for await (const next of generator) {
      if (await predicate(next)) yield next;
    }
  };
}
