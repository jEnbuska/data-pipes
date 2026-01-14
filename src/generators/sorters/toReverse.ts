import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function toReverseSync<TInput>(
  source: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* reverseSyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function toReverseAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
): AsyncYieldedProvider<Awaited<TInput>, Array<Awaited<TInput>>> {
  return async function* reverseAsyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}
