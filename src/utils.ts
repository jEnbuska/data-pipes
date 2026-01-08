import type { AsyncProviderFunction, ProviderFunction } from "./types";

function disposable<P extends ProviderFunction<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};
function disposable<P extends AsyncProviderFunction<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};

function disposable(
  source: ProviderFunction<any> | AsyncProviderFunction<any>,
) {
  const generator = source();
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}
export const InternalStreamless = {
  isAsyncGeneratorFunction<TInput>(
    source: unknown,
  ): source is AsyncProviderFunction<TInput> {
    return (
      Boolean(source) &&
      Object.getPrototypeOf(source).constructor.name ===
        "AsyncGeneratorFunction"
    );
  },

  invoke<T>(cb: () => T) {
    return cb();
  },

  disposable,
  createDefault<T>(defaultValue: T) {
    return () => defaultValue;
  },

  returnUndefined(this: any) {
    return undefined;
  },

  returnTrue(): true {
    return true;
  },

  returnFalse(): false {
    return false;
  },

  returnZero() {
    return 0;
  },

  once<TArgs extends any[], TReturn>(cb: (...args: TArgs) => TReturn) {
    let result: undefined | { value: TReturn };
    return function invokeOnce(...args: TArgs) {
      if (result) return result.value;
      result = { value: cb(...args) };
      return result.value;
    };
  },

  createResolvable<R>(): Promise<{
    promise: Promise<R>;
    resolve(data: R): void;
  }> {
    // eslint-disable-next-line promise/param-names
    return new Promise((resolveCreateResolvable) => {
      const promise = new Promise<R>((resolve) =>
        resolveCreateResolvable({
          get promise(): Promise<R> {
            return promise;
          },
          resolve(data: R) {
            resolve(data);
          },
        }),
      );
    });
  },
};
