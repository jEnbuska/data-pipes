import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function tapSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  consumer: (next: TInput) => unknown,
): SyncYieldedProvider<TInput> {
  return function* tapSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* tapAsyncGenerator(signal) {
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
