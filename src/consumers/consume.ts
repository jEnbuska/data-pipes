import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function consumeSync(generator: YieldedIterator<unknown>) {
  for (const _ of generator) {
    /* Do nothing */
  }
}

export async function consumeAsync(generator: YieldedAsyncGenerator<unknown>) {
  for await (const _ of generator) {
    /* Do nothing */
  }
}
