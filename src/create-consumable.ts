import { toArray, consume, first } from "./consumers";
import {
  type GeneratorProvider,
  type GeneratorConsumable,
  type AsyncGeneratorProvider,
} from "./types.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";

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
    first<Default>(...args: [Default] | []) {
      return first<Default, TInput>(...args)(generator);
    },
  };
}

export function createAsyncConsumable<TInput>(
  generator: AsyncGeneratorProvider<TInput>,
): GeneratorConsumable<TInput, true> {
  return {
    [Symbol.iterator]: undefined,
    [Symbol.toStringTag]: "GeneratorConsumer",
    [Symbol.asyncIterator]: generator[Symbol.asyncIterator].bind(generator),
    async toArray() {
      return toArrayAsync()(generator);
    },
    async consume() {
      return consumeAsync()(generator);
    },
    async first<Default>(...args: [Default] | []) {
      return firstAsync<Default, TInput>(...args)(generator);
    },
  };
}
