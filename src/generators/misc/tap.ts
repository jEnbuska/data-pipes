import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function tapSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  consumer: (next: TInput) => unknown,
): SyncYieldedProvider<TInput> {
  return function* tapSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* tapAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
