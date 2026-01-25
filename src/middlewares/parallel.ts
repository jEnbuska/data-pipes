import type { YieldedAsyncGenerator } from "../types.ts";

export async function* parallel<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  if (count < 1) {
    throw new Error(`parallel count must be 1 or larger, but got ${count}`);
  }
  const promises = new Map<
    number,
    Promise<{ key: number } & IteratorResult<T>>
  >();
  let nextKey = 0;
  const wasDone = false;
  function add(next: Promise<IteratorResult<T>> | IteratorResult<T>) {
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
}
