import { type YieldedProvider } from "./types.ts";

export const _yielded = {
  getDisposableAsyncGenerator<T>(
    provider: YieldedAsyncProvider<T>,
    signal: AbortSignal,
  ) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
  getDisposableGenerator<T>(provider: YieldedProvider<T>, signal: AbortSignal) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
  getTrue: () => true,
  getUndefined: () => undefined,
  getZero: () => 0,
  invoke<T>(cb: () => T) {
    return cb();
  },
  createMemoize1<T, R>(cb: (arg: T) => R) {
    const map = new Map<T, R>();
    return Object.assign(
      (next: T) => {
        if (!map.has(next)) return map.set(next, cb(next));
        return map.get(next)!;
      },
      {
        dispose() {
          map.clear();
        },
      },
    );
  },
  once<TArgs extends any[], TReturn>(cb: (...args: TArgs) => TReturn) {
    let result: undefined | { value: TReturn };
    return function invokeOnce(...args: TArgs) {
      if (result) return result.value;
      result = { value: cb(...args) };
      return result.value;
    };
  },
};
