import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function toReverseSync<TInput>(
  source: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* reverseSyncGenerator() {
    const acc: TInput[] = [];
    using generator = _internalYielded.disposable(source);
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
  return async function* reverseAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}
