import { _yielded } from "../_internal.ts";
import { consumeAsync } from "../consumers/consume.ts";
import { firstAsync } from "../consumers/first.ts";
import { findAsync } from "../generators/finders/find.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import { type AsyncProvider, type AsyncSingleYielded } from "../types.ts";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";

const stringTag = "AsyncSingleYielded";
export function asyncSingleYielded<TData, TOptional extends boolean>(
  provider: AsyncProvider<Awaited<TData>>,
  getDefault?: () => TData,
): AsyncSingleYielded<TData, TOptional> {
  function defaultTo<TDefault>(getDefault: () => TDefault) {
    return asyncSingleYielded<TData | TDefault, false>(provider, getDefault);
  }
  return {
    [Symbol.toStringTag]: stringTag,
    defaultTo: (getDefault ? undefined : defaultTo) as any,
    consume(signal?: AbortSignal) {
      return consumeAsync(provider, signal);
    },

    find(predicate: (next: Awaited<TData>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        true,
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
        optional,
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
