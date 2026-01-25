import type { YieldedSyncGenerator } from "../../types.ts";

export async function* awaited<TInput>(
  generator: YieldedSyncGenerator<TInput>,
): AsyncGenerator<TInput, void, undefined & void> {
  for (const next of generator) {
    yield next;
  }
}
