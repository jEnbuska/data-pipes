import type { AsyncProviderFunction, ProviderFunction } from "./types.ts";

export function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncProviderFunction<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}

export function invoke<T>(cb: () => T) {
  return cb();
}

export function disposable<P extends ProviderFunction<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};
export function disposable<P extends AsyncProviderFunction<any>>(
  source: P,
): ReturnType<P> & {
  [Symbol.dispose]: () => void;
};
export function disposable(
  source: ProviderFunction<any> | AsyncProviderFunction<any>,
) {
  const generator = source();
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}

export function createDefault<T>(defaultValue: T) {
  return () => defaultValue;
}
export function returnUndefined() {
  return undefined;
}
