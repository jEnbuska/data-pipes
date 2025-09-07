import {
  type GeneratorProvider,
  type SyncPipeSource,
  type GeneratorConsumable,
  type AsyncPipeSource,
  type AsyncGeneratorProvider,
} from "./types.ts";

function isGeneratorFunction<TInput>(
  source: unknown,
): source is () => GeneratorProvider<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

function isGeneratorConsumer<TInput>(
  source: unknown,
): source is GeneratorConsumable<TInput> {
  return source?.toString?.() === "[object GeneratorConsumer]";
}

export async function* createAsyncProvider<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncGeneratorProvider<TInput> {
  yield* source();
}

export function* createProvider<TInput>(
  source: SyncPipeSource<TInput>,
): GeneratorProvider<TInput> {
  if (isGeneratorFunction<TInput>(source)) {
    yield* source();
  } else if (Array.isArray(source) || isGeneratorConsumer(source)) {
    yield* source;
  } else {
    yield source;
  }
}
