import type { YieldedAsyncMiddleware } from "../../types.ts";

export default function parallel<TInput>(
  count: number,
): YieldedAsyncMiddleware<TInput, TInput> {
  if (count < 1) {
    throw new Error(`parallel count must be 1 or larger, but got ${count}`);
  }
  return async function* parallelMiddleware(generator) {
    const promises = new Map<
      number,
      Promise<{ key: number } & IteratorResult<TInput>>
    >();
    let nextKey = 0;
    const wasDone = false;
    function add(
      next: Promise<IteratorResult<TInput>> | IteratorResult<TInput>,
    ) {
      const key = nextKey++;
      promises.set(
        key,
        Promise.resolve(next).then(({ value, done: isDone }) => ({
          key,
          value,
          done: isDone || wasDone,
        })),
      );
    }
    /* Trigger 'count' amount for tasks to be run parallel */
    while (promises.size < count) {
      add(generator.next());
    }
    while (promises.size) {
      const { key, value, done } = await Promise.race(promises.values());
      promises.delete(key);
      if (done) continue;
      yield value;
      // Add next task to be executed
      add(generator.next());
    }
  };
}
