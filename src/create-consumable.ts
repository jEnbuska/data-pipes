import {
  type GeneratorConsumable,
  type AsyncPipeSource,
  type PipeSource,
} from "./types.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consume, first, toArray } from "./consumers";
import { disposable } from "./utils.ts";

export function createConsumable<TInput, TDefault>(
  source: PipeSource<TInput>,
  getDefault: () => TDefault,
): GeneratorConsumable<TInput, false, TDefault> {
  return {
    [Symbol.toStringTag]: "GeneratorConsumer",
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

export function createAsyncConsumable<TInput, TDefault>(
  source: AsyncPipeSource<TInput>,
  getDefault: () => TDefault,
): GeneratorConsumable<TInput, true, TDefault> {
  return {
    [Symbol.toStringTag]: "AsyncGeneratorConsumer",
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
