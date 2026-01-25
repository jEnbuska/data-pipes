import type { YieldedAsyncGenerator } from "../types.ts";

export async function toArrayAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
): Promise<TInput[]> {
  const acc: TInput[] = [];
  for await (const next of generator) acc.push(next);
  return acc;
}
