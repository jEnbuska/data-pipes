import {
  type YieldedAsyncProvider,
  type AsyncSingleYielded,
} from "../types.ts";
import { firstAsync } from "../consumers/first.ts";
import { _internalY } from "../utils.ts";
import { consumeAsync } from "../consumers/consume.ts";

import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { findAsync } from "../generators/finders/find.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import { mapAsync } from "../generators/misc/map.ts";

const stringTag = "AsyncSingleYielded";
export function asyncSingleYielded<TInput, TDefault>(
  provider: YieldedAsyncProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): AsyncSingleYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      const { resolve } = asyncSingleYielded(provider, getDefault);
      return { resolve };
    },
    tap(callback) {
      return asyncSingleYielded(tapAsync(provider, callback), getDefault);
    },
    lift(middleware) {
      return asyncIterableAYielded(liftAsync(provider, middleware));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return asyncIterableAYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return asyncIterableAYielded(flatMapAsync(provider, callback));
    },
    map(mapper) {
      return asyncSingleYielded(
        mapAsync(provider, mapper),
        _internalY.getUndefined,
      );
    },
    resolve(signal?: AbortSignal) {
      return firstAsync(provider, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(provider, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
