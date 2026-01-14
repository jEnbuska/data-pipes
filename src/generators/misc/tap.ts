import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function tapSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  consumer: (next: TInput) => unknown,
): SyncYieldedProvider<TInput> {
  return function* tapSyncGenerator() {
    using generator = _internalYielded.disposable(source);
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
  return async function* tapAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
