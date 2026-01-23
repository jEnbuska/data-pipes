import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function tapSync<TInput>(
  consumer: (next: TInput) => unknown,
): YieldedSyncMiddleware<TInput> {
  return function* tapSyncResolver(generator) {
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TInput>(
  consumer: (next: TInput) => unknown,
): YieldedAsyncMiddleware<TInput> {
  return async function* tapAsyncResolver(generator) {
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
