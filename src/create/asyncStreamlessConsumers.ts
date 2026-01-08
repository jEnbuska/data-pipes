import type {
  AsyncProviderFunction,
  ChainableConsumersFunctions,
} from "../types";
import { InternalStreamless } from "../utils";
import { toArrayAsync } from "../consumers/toArray";
import { consumeAsync } from "../consumers/consume";
import { firstAsync } from "../consumers/first";

export default function asyncStreamlessConsumers<TInput, TDefault>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
): ChainableConsumersFunctions<TInput, true, TDefault> {
  return {
    [Symbol.toStringTag]: "AsyncStreamless",
    async *[Symbol.asyncIterator]() {
      using generator = InternalStreamless.disposable(source);
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
