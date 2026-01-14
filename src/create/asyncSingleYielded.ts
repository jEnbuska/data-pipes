import { _yielded } from "../_internal.ts";
import { consumeAsync } from "../consumers/consume.ts";
import { firstAsync } from "../consumers/first.ts";
import { findAsync } from "../generators/finders/find.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import {
  type AsyncSingleYielded,
  type YieldedAsyncProvider,
} from "../types.ts";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";

const stringTag = "AsyncSingleYielded";
export function asyncSingleYielded<TInput, TDefault>(
  provider: YieldedAsyncProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): AsyncSingleYielded<TInput, TDefault> {
  return {
    [Symbol.toStringTag]: stringTag,
    consume(signal?: AbortSignal) {
      return consumeAsync(provider, signal);
    },
    defaultTo<TDefault>(getDefault: () => TDefault) {
      const { resolve } = asyncSingleYielded(provider, getDefault);
      return { resolve };
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        _yielded.getUndefined,
      );
    },
    flat(depth) {
      return asyncIterableAYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return asyncIterableAYielded(flatMapAsync(provider, callback));
    },
    lift(middleware) {
      return asyncIterableAYielded(liftAsync(provider, middleware));
    },
    map(mapper) {
      return asyncSingleYielded(
        mapAsync(provider, mapper),
        _yielded.getUndefined,
      );
    },
    resolve(signal?: AbortSignal) {
      return firstAsync(provider, getDefault, signal);
    },
    tap(callback) {
      return asyncSingleYielded(tapAsync(provider, callback), getDefault);
    },
  };
}
