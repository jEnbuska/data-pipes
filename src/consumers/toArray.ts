import type { YieldedAsyncGenerator } from "../shared.types.ts";

export async function toArrayAsync<T>(
  generator: YieldedAsyncGenerator<T>,
): Promise<T[]> {
  const acc: T[] = [];
  for await (const next of generator) acc.push(next);
  return acc;
}
