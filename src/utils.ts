import type { AsyncYieldedProvider, SyncYieldedProvider } from "./types";

function disposable<P extends SyncYieldedProvider<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};
function disposable<P extends AsyncYieldedProvider<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};

function disposable(
  source: SyncYieldedProvider<any> | AsyncYieldedProvider<any>,
) {
  const generator = source();
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}
export const _internalYielded = {
  invoke<T>(cb: () => T) {
    return cb();
  },
  disposable,
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
  getEmptyList: <T>(): T[] => [],
  getTrue: () => true,
  getFalse: () => false,
};
