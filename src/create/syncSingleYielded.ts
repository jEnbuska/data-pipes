import { _yielded } from "../_internal.ts";
import { consumeSync } from "../consumers/consume.ts";
import { firstSync } from "../consumers/first.ts";
import { findSync } from "../generators/finders/find.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { mapSync } from "../generators/misc/map.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { toAwaited } from "../generators/misc/toAwaited.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import { type SyncSingleYielded, type YieldedSyncProvider } from "../types.ts";
import { asyncSingleYielded } from "./asyncSingleYielded.ts";
import { syncIterableYielded } from "./syncIterableYielded.ts";

const stringTag = "SyncSingleYielded";
export function syncSingleYielded<TInput, TDefault>(
  provider: YieldedSyncProvider<TInput>,
  getDefault: () => TDefault,
): SyncSingleYielded<TInput, TDefault> {
  return {
    [Symbol.toStringTag]: stringTag,
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    defaultTo<TDefault>(getDefault: () => TDefault) {
      const { resolve } = syncSingleYielded(provider, getDefault);
      return { resolve };
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(
        findSync(provider, predicate),
        _yielded.getUndefined,
      );
    },
    flat(depth) {
      return syncIterableYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return syncIterableYielded(flatMapSync(provider, callback));
    },
    lift(middleware) {
      return syncIterableYielded(liftSync(provider, middleware));
    },
    map(mapper) {
      return syncSingleYielded(
        mapSync(provider, mapper),
        _yielded.getUndefined,
      );
    },
    resolve(signal?: AbortSignal) {
      return firstSync(provider, getDefault, signal);
    },
    tap(callback) {
      return syncSingleYielded(tapSync(provider, callback), getDefault);
    },
    toAwaited() {
      return asyncSingleYielded(toAwaited(provider), _yielded.getUndefined);
    },
  };
}
