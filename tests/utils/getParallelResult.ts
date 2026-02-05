import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";

export async function getParallelResult<T>(
  gen: IYieldedParallelGenerator<T>,
): Promise<Awaited<T>[]> {
  const results: Promise<T>[] = [];
  let next = await gen.next();
  while (!next.done) {
    results.push(next.value satisfies Promise<T>);
    next = await gen.next();
  }
  return Promise.all(results);
}