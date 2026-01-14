import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { getDisposableGenerator } from "../../";

export function resolve<TInput>(
  provider: SyncYieldedProvider<TInput>,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* resolveSyncGenerator(signal) {
    using generator = getDisposableGenerator(provider, signal);
    for await (const next of generator) {
      yield next;
    }
  };
}

export function resolveParallel(
  provider: SyncYieldedProvider<any>,
  count: number,
): AsyncYieldedProvider<Awaited<any>> {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid count ${count} passed to resolveParallel`);
  }
  return async function* resolveParallelGenerator(signal) {
    using generator = getDisposableGenerator(provider, signal);
    const promises = new Map<string, Promise<{ key: string; value: any }>>();
    let nextKey = 0;
    function add(value: any) {
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
      yield value;
      promises.delete(key);
      const next = generator.next();
      if (next.done) continue;
      // Add next task to be executed
      add(next.value);
    }
  };
}
