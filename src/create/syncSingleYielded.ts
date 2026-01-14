import { type YieldedSyncProvider, type SyncSingleYielded } from "../types.ts";
import { firstSync } from "../consumers/first.ts";
import { consumeSync } from "../consumers/consume.ts";
import { syncIterableYielded } from "./syncIterableYielded.ts";
import { asyncSingleYielded } from "./asyncSingleYielded.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { _internalY } from "../utils.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { findSync } from "../generators/finders/find.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import { mapSync } from "../generators/misc/map.ts";
import { toAwaited } from "../generators/misc/toAwaited.ts";

const stringTag = "SyncSingleYielded";
export function syncSingleYielded<TInput, TDefault>(
  provider: YieldedSyncProvider<TInput>,
  getDefault: () => TDefault,
): SyncSingleYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      const { resolve } = syncSingleYielded(provider, getDefault);
      return { resolve };
    },
    tap(callback) {
      return syncSingleYielded(tapSync(provider, callback), getDefault);
    },
    lift(middleware) {
      return syncIterableYielded(liftSync(provider, middleware));
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(
        findSync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return syncIterableYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return syncIterableYielded(flatMapSync(provider, callback));
    },
    map(mapper) {
      return syncSingleYielded(
        mapSync(provider, mapper),
        _internalY.getUndefined,
      );
    },
    resolve(signal?: AbortSignal) {
      return firstSync(provider, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    [Symbol.toStringTag]: stringTag,
    toAwaited() {
      return asyncSingleYielded(toAwaited(provider), _internalY.getUndefined);
    },
  };
}
