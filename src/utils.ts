import type { YieldedSyncProvider, YieldedAsyncProvider } from "./types";

export const _internalY = {
  invoke<T>(cb: () => T) {
    return cb();
  },
  once<TArgs extends any[], TReturn>(cb: (...args: TArgs) => TReturn) {
    let result: undefined | { value: TReturn };
    return function invokeOnce(...args: TArgs) {
      if (result) return result.value;
      result = { value: cb(...args) };
      return result.value;
    };
  },
  getZero: () => 0,
  getUndefined: () => undefined,
  getTrue: () => true,
  getDisposableGenerator<TInput>(
    provider: YieldedSyncProvider<TInput>,
    signal: AbortSignal,
  ) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
  getDisposableAsyncGenerator<TInput>(
    provider: YieldedAsyncProvider<TInput>,
    signal: AbortSignal,
  ) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
};
