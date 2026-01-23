export function toAwaited<TInput>() {
  return async function* toAwaitedResolver(
    generator: Generator<TInput, unknown, undefined & void>,
  ): AsyncGenerator<TInput, void, undefined & void> {
    for (const next of generator) {
      yield next;
    }
  };
}

export function toAwaitedParallel(
  count: number,
): (
  generator: Generator<any, unknown, undefined & void>,
) => AsyncGenerator<any, void, undefined & void> {
  return async function* toAwaitedParallelProvider(generator) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`Invalid count ${count} passed to toAwaitedParallel`);
    }
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
