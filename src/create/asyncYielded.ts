import type { Yielded, YieldedAsyncGenerator } from "../types.ts";
import { asyncConsumers } from "./asyncConsumers.ts";
import { asyncMiddlewares } from "./asyncMiddlewares.ts";

export function asyncYielded<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
): Yielded<true, TInput> {
  return {
    [Symbol.toStringTag]: "AsyncYielded",
    ...asyncMiddlewares<TInput>(generator),
    ...asyncConsumers(generator),
  };
}
