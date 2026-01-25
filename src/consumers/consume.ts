import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function consumeSync(generator: YieldedIterator) {
  for (const _ of generator) {
    /* Do nothing */
  }
}

export async function consumeAsync(generator: YieldedAsyncGenerator) {
  for await (const _ of generator) {
    /* Do nothing */
  }
}
