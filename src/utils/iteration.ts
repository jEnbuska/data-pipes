import type { IYieldedIterableSource } from "../resolvers/resolver.types.ts";
import type { IYieldedGenerator, MaybeAsync } from "../shared.types.ts";

export function isAsyncIterableProvider<T>(
  value: unknown,
): value is IYieldedIterableSource<T, "async"> {
  if (isIterableProvider(value)) return true;
  return (
    Boolean(value) &&
    typeof (value as AsyncIterable<any>)[Symbol.asyncIterator] === "function"
  );
}

function isAsyncIterable<T>(value: unknown): value is AsyncIterable<T> {
  return (
    Boolean(value) &&
    typeof (value as AsyncIterable<any>)[Symbol.asyncIterator] === "function"
  );
}

function isIterable<T>(value: unknown): value is Iterable<T> {
  return (
    Boolean(value) &&
    typeof (value as Iterable<any>)[Symbol.iterator] === "function"
  );
}

export function asyncIterableProviderToAsyncIterable<T>(
  value: IYieldedIterableSource<T, "async">,
): AsyncIterable<T> | Iterable<T> {
  if (isAsyncIterable<T>(value)) {
    return value;
  }
  if (isIterable<T>(value)) {
    return value;
  }
  const disposed = false;
  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return {
        async next(): Promise<IteratorResult<T>> {
          if (disposed) return { done: true, value: undefined };
          return (value as any).next();
        },
      };
    },
  };
}
export function isIterableProvider<T>(
  value: unknown,
): value is IYieldedIterableSource<T, "sync"> {
  if (!value || typeof value !== "object") return false;
  if ("next" in value && typeof (value as any).next === "function") return true;
  return typeof (value as Iterable<any>)[Symbol.iterator] === "function";
}

export function iterableProviderToIterable<T>(
  value: IYieldedIterableSource<T, "sync">,
): Iterable<T> {
  if (typeof (value as Iterable<any>)[Symbol.iterator] === "function") {
    return value as Iterable<T>;
  }
  return {
    [Symbol.iterator]() {
      return {
        next(): IteratorResult<T> {
          return (value as any).next() as any;
        },
      };
    },
  };
}

function parallelIterableProviderToAsyncIterable<TOut>(
  value: IYieldedIterableSource<TOut, "parallel">,
): AsyncIterator<MaybeAsync<TOut>> | Iterator<MaybeAsync<TOut>> {
  if ("next" in value && typeof (value as any).next === "function") {
    return value as AsyncIterator<TOut> | Iterator<TOut>;
  }
  if (
    typeof (value as AsyncIterable<TOut>)[Symbol.asyncIterator] === "function"
  ) {
    return (value as any)[Symbol.asyncIterator]() as AsyncIterator<TOut>;
  }
  if (typeof (value as Iterable<TOut>)[Symbol.iterator] === "function") {
    return (value as any)[Symbol.iterator]() as Iterator<TOut>;
  }
  throw new Error("Invalid IYieldedIterableSource parallel source");
}

export class ParallelBufferGenerator<T> implements IYieldedGenerator<
  T,
  "async"
> {
  #iterator: AsyncIterator<MaybeAsync<T>> | Iterator<MaybeAsync<T>>;

  constructor(source: IYieldedIterableSource<T, "parallel">) {
    this.#iterator = parallelIterableProviderToAsyncIterable(source);
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  async [Symbol.asyncDispose]() {}

  async return(): Promise<IteratorResult<T, undefined | void>> {
    return { done: true, value: undefined };
  }

  async throw(): Promise<IteratorResult<T, undefined | void>> {
    return { done: true, value: undefined };
  }

  async next(): Promise<IteratorResult<T, void | undefined>> {
    const result = await this.#iterator.next();
    if (result.done) {
      return result;
    }
    return { done: false, value: await result.value };
  }
}
