import {
  type GeneratorConsumable,
  type AsyncPipeSource,
  type PipeSource,
} from "./types.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consume, first, toArray } from "./consumers";

export function createConsumable<TInput, TDefault = undefined>(
  source: PipeSource<TInput>,
  defaultValue?: TDefault,
): GeneratorConsumable<TInput> {
  return {
    [Symbol.toStringTag]: "GeneratorConsumer",
    toArray(signal?: AbortSignal) {
      return toArray<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consume<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return first<TInput, TDefault>(
        source,
        defaultValue as TDefault,
        signal,
      ) as any;
    },
  };
}

export function createAsyncConsumable<TInput, TDefault = undefined>(
  source: AsyncPipeSource<TInput>,
  defaultValue?: TDefault,
): GeneratorConsumable<TInput, true> {
  return {
    [Symbol.toStringTag]: "AsyncGeneratorConsumer",
    toArray(signal?: AbortSignal) {
      return toArrayAsync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return firstAsync<TInput, TDefault>(
        source,
        defaultValue as TDefault,
        signal,
      ) as any;
    },
  };
}
