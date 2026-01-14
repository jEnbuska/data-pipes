import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function toReverseSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
): YieldedSyncProvider<TInput, TInput[]> {
  return function* reverseSyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function toReverseAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
): YieldedAsyncProvider<Awaited<TInput>, Array<Awaited<TInput>>> {
  return async function* reverseAsyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}
