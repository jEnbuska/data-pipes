import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function minBySync<T>(
  generator: YieldedIterator<T>,
  callback: (next: T) => number,
): T | undefined {
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

export async function minByAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  callback: (next: T) => PromiseOrNot<number>,
): Promise<T | undefined> {
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
