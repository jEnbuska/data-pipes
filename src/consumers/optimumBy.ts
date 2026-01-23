import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function optimumBySync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  callback: (current: TInput, next: TInput, index: number) => boolean,
): TInput | undefined {
  const generator = invoke();
  const next = generator.next();
  if (next.done) return;
  let acc = next.value;
  let index = 0;
  for (const next of generator) {
    if (callback(acc, next, index++)) {
      acc = next;
    }
  }
  return acc;
}

export async function optimumByAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  callback: (
    previous: TInput,
    next: TInput,
    index: number,
  ) => Promise<boolean> | boolean,
): Promise<TInput | undefined> {
  const generator = invoke();
  const next = await generator.next();
  if (next.done) return;
  let acc = Promise.resolve(next.value);
  let index = 0;
  for await (const next of generator) {
    acc = acc.then(async (acc): Promise<Awaited<TInput>> => {
      const optimum = await callback(acc, next, index++);
      if (optimum) return next;
      return acc;
    });
  }
  return acc;
}
