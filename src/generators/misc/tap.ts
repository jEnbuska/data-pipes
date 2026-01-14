import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function tapSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  consumer: (next: TInput) => unknown,
): YieldedSyncProvider<TInput> {
  return function* tapSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  consumer: (next: TInput) => unknown,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* tapAsyncGenerator(signal) {
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
