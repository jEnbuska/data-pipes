import {
  type GeneratorConsumable,
  type AsyncPipeSource,
  type PipeSource,
} from "./types.ts";
import { consumeAsync } from "./consumers/consume.ts";
import { firstAsync } from "./consumers/first.ts";
import { toArrayAsync } from "./consumers/toArray.ts";
import { consume, first, toArray } from "./consumers";
import { isAbortSignal } from "./utils.ts";

export function createConsumable<TInput>(
  source: PipeSource<TInput>,
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
      return first<TInput>(source, signal);
    },
  };
}

export function createAsyncConsumable<TInput>(
  source: AsyncPipeSource<TInput>,
): GeneratorConsumable<TInput, true> {
  return {
    [Symbol.toStringTag]: "AsyncGeneratorConsumer",
    toArray(signal?: AbortSignal) {
      return toArrayAsync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    first<TDefault = void>(
      ...args: Parameters<GeneratorConsumable<TInput, true>["first"]>
    ) {
      const defaultValue = (
        args[0] && isAbortSignal(args[0]) ? undefined : args[0]
      ) as TDefault;
      const signal: AbortSignal | undefined = isAbortSignal(args[0])
        ? args[0]
        : isAbortSignal(args[1])
          ? args[1]
          : undefined;
      return firstAsync<TInput, TDefault>(source, defaultValue, signal);
    },
  };
}
