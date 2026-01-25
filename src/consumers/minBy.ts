import type { YieldedAsyncGenerator, YieldedSyncGenerator } from "../types.ts";

export function minBySync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  callback: (next: TInput) => number,
): TInput | undefined {
  const next = generator.next();
  if (next.done) return;
  let current = next.value;
  let currentMin = callback(current);
  for (const next of generator) {
    const value = callback(next);
    if (value < currentMin) {
      current = next;
      currentMin = value;
    }
  }
  return current;
}

export async function minByAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  callback: (next: TInput) => Promise<number> | number,
): Promise<TInput | undefined> {
  const next = await generator.next();
  if (next.done) return;
  let acc = next.value;
  let min = callback(acc);
  const pending = new Set<Promise<unknown> | unknown>([min]);
  for await (const next of generator) {
    const promise = Promise.resolve(callback(next)).then(async (numb) => {
      if (numb < (await min)) {
        acc = next;
        min = numb;
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
