import {
  type AsyncGeneratorProvider,
  type GeneratorConsumable,
  type GeneratorProvider,
} from "./types.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consume, first, toArray } from "./consumers";

export function createConsumable<TInput>(
  generator: GeneratorProvider<TInput>,
): GeneratorConsumable<TInput> {
  return {
    [Symbol.asyncIterator]: undefined,
    [Symbol.iterator]: generator[Symbol.iterator].bind(generator),
    [Symbol.toStringTag]: "GeneratorConsumer",
    toArray() {
      return toArray()(generator);
    },
    consume() {
      return consume()(generator);
    },
    first(_?: AbortSignal) {
      return first<TInput>()(generator);
    },
  };
}

export function createAsyncConsumable<TInput>(
  generator: AsyncGeneratorProvider<TInput>,
  source:
    | GeneratorProvider<unknown>
    | AsyncGeneratorProvider<unknown> = generator,
): GeneratorConsumable<TInput, true> {
  return {
    [Symbol.iterator]: undefined,
    [Symbol.toStringTag]: "GeneratorConsumer",
    [Symbol.asyncIterator]: generator[Symbol.asyncIterator].bind(generator),
    toArray(signal?: AbortSignal) {
      return toArrayAsync(source, signal)(generator);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(source, signal)(generator);
    },
    first(signal?: AbortSignal) {
      return firstAsync<TInput>(source, signal)(generator);
    },
  };
}
