import {
  type GeneratorProvider,
  type PipeSource,
  type GeneratorConsumable,
} from "./types.ts";

function isGeneratorFunction<Input>(
  source: unknown,
): source is () => GeneratorProvider<Input> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

function isGeneratorConsumer<Input>(
  source: unknown,
): source is GeneratorConsumable<Input> {
  return source?.toString?.() === "[object GeneratorConsumer]";
}

export function* createProvider<Input>(
  source: PipeSource<Input>,
): GeneratorProvider<Input> {
  if (isGeneratorFunction<Input>(source)) {
    yield* source();
  } else if (Array.isArray(source) || isGeneratorConsumer(source)) {
    yield* source;
  } else {
    yield source;
  }
}
