import type { AsyncPipeSource } from "../types.ts";

export function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncPipeSource<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
