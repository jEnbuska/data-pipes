import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function toReverseSync<TInput>(
  source: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* reverseSyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = _internalY.getDisposableGenerator(source, signal);
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
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}
