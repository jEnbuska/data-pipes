import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function liftSync<TInput, TOutput>(
  middleware: YieldedSyncMiddleware<TInput, TOutput>,
): YieldedSyncMiddleware<TInput, TOutput> {
  return function* liftSyncResolver(generator) {
    return middleware(generator);
  };
}

export function liftAsync<TInput, TOutput>(
  middleware: YieldedAsyncMiddleware<TInput, TOutput>,
): YieldedAsyncMiddleware<TInput, TOutput> {
  return async function* liftAsyncResolver(generator) {
    for await (const next of middleware(generator)) {
      yield next;
    }
  };
}
