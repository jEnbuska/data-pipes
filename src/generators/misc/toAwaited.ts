import { _yielded } from "../../_internal.ts";
import type { AsyncOperatorResolver } from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function toAwaitedSync<TArgs extends any[], TIn>(
  parallel: number | boolean = 1,
): AsyncOperatorResolver<TArgs, TIn> {
  const _parallel = _yielded.invoke(() => {
    if (parallel === true) return Number.MAX_SAFE_INTEGER;
    if (parallel === false) return 1;
    if (parallel < 1) {
      throw new Error("toAwaited parallel must be boolean or positive integer");
    }
    return parallel;
  });
  return async function* toAwaitedResolver(...args) {
    using generator = startGenerator(...args);
    const promises = new Map<string, Promise<{ key: string; value: any }>>();
    let nextKey = 0;
    function addTask(value: any) {
      const key = `${nextKey++}`;
      promises.set(
        key,
        Promise.resolve(value).then((value) => ({ key, value })),
      );
    }
    /* Trigger 'count' amount for tasks to be run parallel */
    while (_parallel < promises.size) {
      const next = await generator.next();
      if (next.done) break;
      addTask(next.value);
    }

    while (promises.size) {
      const { key, value } = await Promise.race(promises.values());
      yield value;
      promises.delete(key);
      const next = await generator.next();
      if (next.done) continue;
      // Add next task to be executed
      addTask(next.value);
    }
  };
}

export default defineOperator({
  name: "toAwaited",
  toAsync: true,
  toAwaitedSync,
  toAwaitedAsync: undefined,
});
