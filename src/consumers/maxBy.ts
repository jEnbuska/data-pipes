import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function maxBySync<TInput>(
  generator: YieldedIterator<TInput>,
  callback: (next: TInput) => number,
): TInput | undefined {
  const next = generator.next();
  if (next.done) return;
  let current = next.value;
  let currentMax = callback(current);
  for (const next of generator) {
    const value = callback(next);
    if (value > currentMax) {
      current = next;
      currentMax = value;
    }
  }
  return current;
}

export async function maxByAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  callback: (next: TInput) => Promise<number> | number,
): Promise<TInput | undefined> {
  const next = await generator.next();
  if (next.done) return;
  let acc = next.value;
  let max = callback(acc);
  const pending = new Set<Promise<unknown> | unknown>([max]);
  for await (const next of generator) {
    const promise = Promise.resolve(callback(next)).then(async (numb) => {
      if (numb > (await max)) {
        acc = next;
        max = numb;
      }
    });
    pending.add(promise);
    void promise.then(() => {
      pending.delete(promise);
    });
  }
  await Promise.all(pending.values());
  return acc;
}
