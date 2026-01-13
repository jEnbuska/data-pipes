import {
  type AsyncStreamlessProvider,
  type SyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function toReverseSync<TInput>(
  source: SyncStreamlessProvider<TInput>,
): SyncStreamlessProvider<TInput, TInput[]> {
  return function* reverseSyncGenerator() {
    const acc: TInput[] = [];
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function toReverseAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
): AsyncStreamlessProvider<Awaited<TInput>, Array<Awaited<TInput>>> {
  return async function* reverseAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}
