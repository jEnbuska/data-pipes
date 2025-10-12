import type { AsyncPipeSource } from "./types.ts";

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

export function isAbortSignal(value: unknown): value is AbortSignal {
  return typeof AbortSignal !== "undefined" && value instanceof AbortSignal;
}
