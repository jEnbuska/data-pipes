import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export interface IYieldedConsume<TAsync extends boolean> {
  /**
   *  Fully consumes the generator without producing a result.
   *
   *  Iterates through all items, effectively discarding them. Useful when
   *  you want to trigger all side effects of the generator or ensure that
   *  all asynchronous operations are completed.
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .forEach(n => console.log(n))
   *   .consume() satisfies void;
   *  */
  consume(): ReturnValue<void, TAsync>;
}

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
