import type { AsyncStreamlessProvider, StreamlessProvider } from "./types";

function disposable<P extends StreamlessProvider<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};
function disposable<P extends AsyncStreamlessProvider<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};

function disposable(
  source: StreamlessProvider<any> | AsyncStreamlessProvider<any>,
) {
  const generator = source();
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}
export const _internalStreamless = {
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
};
