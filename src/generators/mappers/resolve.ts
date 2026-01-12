import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function resolve<TInput>(
  source: StreamlessProvider<TInput>,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* resolveGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      yield next as any;
    }
  };
}

export function resolveParallel<TInput>(
  source: StreamlessProvider<TInput>,
  count: number | undefined = 50,
): AsyncStreamlessProvider<Awaited<TInput>> {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid count ${count} passed to resolveParallel`);
  }
  return async function* resolveParallelGenerator() {
    using generator = _internalStreamless.disposable(source);
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
      yield value;
      promises.delete(key);
      const next = generator.next();
      if (next.done) continue;
      // Add next task to be executed
      add(next.value);
    }
  };
}
