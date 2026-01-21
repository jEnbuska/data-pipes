import { type YieldedAsyncProvider } from "../../types.ts";

export function toAwaited<In>(): YieldedAsyncProvider<Awaited<In>> {
  return async function* toAwaitedGenerator(generator) {
    for await (const next of generator) {
      yield next;
    }
  };
}

export function toAwaitedParallel(
  count: number,
): (
  generator: Generator<unknown, void, undefined & void>,
) => AsyncGenerator<Awaited<unknown>, void, undefined & void> {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid count ${count} passed to toAwaitedParallel`);
  }
  return async function* toAwaitedParallelGenerator(generator) {
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
