import { _yielded } from "../_internal.ts";
import type {
  AsyncConsumer,
  AsyncProvider,
  SyncConsumer,
  SyncProvider,
} from "../types.ts";

export function withProvider<TOut, TNext>(
  provider: SyncProvider<TOut>,
  consumer: SyncConsumer<TOut, TNext>,
): SyncProvider<TNext> {
  return function* syncProviderResolver(signal: AbortSignal) {
    using providerGenerator = _yielded.getDisposableGenerator(provider, signal);
    const generator = consumer(providerGenerator);
    for (const value of generator) {
      yield value;
    }
  };
}

export function withAsyncProvider<TOut, TNext>(
  provider: AsyncProvider<TOut>,
  consumer: AsyncConsumer<TOut, TNext>,
): AsyncProvider<TNext> {
  return async function* syncProviderResolver(signal: AbortSignal) {
    using providerGenerator = _yielded.useAsyncGenerator(provider, signal);
    const generator = consumer(providerGenerator);
    for await (const value of generator) {
      yield value;
    }
  };
}
