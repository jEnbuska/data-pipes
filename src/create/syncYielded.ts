import type { Yielded, YieldedSyncGenerator } from "../types.ts";
import { syncConsumers } from "./syncConsumers.ts";
import { syncMiddlewares } from "./syncMiddlewares.ts";

export function syncYielded<TInput>(
  generator: YieldedSyncGenerator<TInput>,
): Yielded<false, TInput> {
  const sharedProperties = {} as const;
  return {
    [Symbol.toStringTag]: "SyncYielded",
    ...sharedProperties,
    ...syncMiddlewares<TInput>(generator),
    ...syncConsumers(generator),
  } satisfies Yielded<false, TInput>;
}
