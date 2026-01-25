import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

function counter(_acc: unknown, _next: unknown, index: number) {
  return index + 1;
}
export function countSync<T>(generator: YieldedIterator<T>): number {
  return generator.reduce(counter, 0);
}

export async function countAsync<T>(
  generator: YieldedAsyncGenerator<T>,
): Promise<number> {
  let acc = 0;
  for await (const _ of generator) {
    acc++;
  }
  return acc;
}
