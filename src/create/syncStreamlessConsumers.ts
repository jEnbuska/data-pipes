import {
  type ChainableConsumersFunctions,
  type ProviderFunction,
} from "../types";
import { consume, first, toArray } from "../consumers";
import { InternalStreamless } from "../utils";

export default function syncStreamlessConsumers<TInput, TDefault>(
  source: ProviderFunction<TInput>,
  getDefault: () => TDefault,
): ChainableConsumersFunctions<TInput, false, TDefault> {
  return {
    [Symbol.toStringTag]: "SyncStreamless",
    *[Symbol.iterator]() {
      using generator = InternalStreamless.disposable(source);
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
