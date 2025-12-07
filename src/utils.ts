import type {
  AsyncPipeSource,
  PipeSource,
  Provider,
  AsyncProvider,
} from "./types.ts";

export function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncPipeSource<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}

export function invoke<T>(cb: () => T) {
  return cb();
}

export function disposable<TInput>(source: PipeSource<TInput>): Generator<
  TInput,
  void,
  undefined & void
> & {
  [Symbol.dispose]: () => void;
};
export function disposable<TInput>(
  source: PipeSource<TInput>,
): Provider<TInput> & {
  [Symbol.dispose]: () => void;
};
export function disposable<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncProvider<TInput> & {
  [Symbol.dispose]: () => void;
};
export function disposable(source: any) {
  const generator = source();
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return();
    },
  });
}

export function createDefault<T>(defaultValue: T) {
  return () => defaultValue;
}
export function returnUndefined() {
  return undefined;
}
