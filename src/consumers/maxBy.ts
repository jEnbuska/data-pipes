import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function maxBySync<T>(
  generator: YieldedIterator<T>,
  callback: (next: T) => number,
): T | undefined {
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

export async function maxByAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  callback: (next: T) => PromiseOrNot<number>,
): Promise<T | undefined> {
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
