import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function resolve<TInput>(
  source: SyncYieldedProvider<TInput>,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* resolveSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      yield next as any;
    }
  };
}

export function resolveParallel<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid count ${count} passed to resolveParallel`);
  }
  return async function* resolveParallelGenerator() {
    using generator = _internalYielded.disposable(source);
    const promises = new Map<string, Promise<{ key: string; value: TInput }>>();
    let nextKey = 0;
    function add(value: TInput) {
      const key = `${nextKey++}`;
      promises.set(
        key,
        Promise.resolve(value).then((value) => ({ key, value })),
      );
    }

    /* Trigger 'count' amount for tasks to be run parallel */
    while (promises.size < count) {
      const next = generator.next();
      if (next.done) break;
      add(next.value);
    }

    while (promises.size) {
      const { key, value } = await Promise.race(promises.values());
      yield value as any;
      promises.delete(key);
      const next = generator.next();
      if (next.done) continue;
      // Add next task to be executed
      add(next.value);
    }
  };
}
