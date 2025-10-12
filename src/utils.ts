import type {
  AsyncGeneratorProvider,
  AsyncPipeSource,
  GeneratorProvider,
} from "./types.ts";

export function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncPipeSource<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
export function addReturnRootOnAbortListener(
  signal: AbortSignal | undefined,
  source: GeneratorProvider<any> | AsyncGeneratorProvider<any>,
) {
  signal?.addEventListener("abort", function handleAbort() {
    void source.return();
  });
}

export function invoke<T>(cb: () => T) {
  return cb();
}
