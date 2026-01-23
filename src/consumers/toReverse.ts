import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../types.ts";

export function toReverseSync<TInput>(): YieldedSyncMiddleware<
  TInput,
  TInput,
  TInput[]
> {
  return function* reverseSyncProvider(generator) {
    const acc: TInput[] = [];
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function toReverseAsync<TInput>(): YieldedAsyncMiddleware<
  TInput,
  TInput,
  TInput[]
> {
  return async function* reverseAsyncResolver(generator) {
    const acc: TInput[] = [];

    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}
