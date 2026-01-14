import {
  type AsyncYieldedProvider,
  type SingleAsyncYielded,
  type YieldedLiftMiddleware,
} from "../types";
import { firstAsync } from "../consumers/first";
import { _internalYielded } from "../utils";
import { consumeAsync } from "../consumers/consume";
import {
  findAsync,
  flatAsync,
  flatMapAsync,
  mapAsync,
  tapAsync,
} from "../generators";
import { iterableAsyncYielded } from "./iterableAsyncYielded";

const stringTag = "SingleAsyncYielded";
export function singleAsyncYielded<TInput, TDefault>(
  source: AsyncYieldedProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): SingleAsyncYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(
      getDefault: () => TDefault,
    ): SingleAsyncYielded<TInput, TDefault> {
      return singleAsyncYielded(source, getDefault);
    },
    tap(callback) {
      return singleAsyncYielded(tapAsync(source, callback), getDefault);
    },
    lift<TOutput>(
      middleware: YieldedLiftMiddleware<true, Awaited<TInput>, TOutput>,
    ) {
      return iterableAsyncYielded<TOutput>(middleware(source));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return singleAsyncYielded(
        findAsync(source, predicate),
        _internalYielded.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncYielded(flatAsync(source, depth));
    },
    flatMap(callback) {
      return iterableAsyncYielded(flatMapAsync(source, callback));
    },
    map(mapper) {
      return singleAsyncYielded(
        mapAsync(source, mapper),
        _internalYielded.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstAsync(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(source, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
