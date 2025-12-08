import {
  type ChainableConsumersFunctions,
  type AsyncProviderFunction,
  type ProviderFunction,
} from "./types.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consume, first, toArray } from "./consumers";
import { disposable } from "./utils.ts";

export function createConsumers<TInput, TDefault>(
  source: ProviderFunction<TInput>,
  getDefault: () => TDefault,
): ChainableConsumersFunctions<TInput, false, TDefault> {
  return {
    [Symbol.toStringTag]: "SyncChainable",
    *[Symbol.iterator]() {
      using generator = disposable(source);
      for (const next of generator) {
        yield next;
      }
    },
    toArray(signal?: AbortSignal) {
      return toArray<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consume<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return first<TInput, TDefault>(source, getDefault, signal);
    },
  };
}

export function createAsyncConsumers<TInput, TDefault>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
): ChainableConsumersFunctions<TInput, true, TDefault> {
  return {
    [Symbol.toStringTag]: "AsyncChainable",
    async *[Symbol.asyncIterator]() {
      using generator = disposable(source);
      for await (const next of generator) {
        yield next;
      }
    },
    toArray(signal?: AbortSignal) {
      return toArrayAsync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return firstAsync<TInput, TDefault>(source, getDefault, signal);
    },
  };
}
