import {
  type GeneratorProvider,
  type PipeSource,
  type GeneratorConsumable,
} from "./types.ts";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

function isGeneratorConsumer(
  source: unknown,
): source is GeneratorConsumable<unknown> {
  return source?.toString?.() === "[object GeneratorConsumer]";
}

export function* createProvider<Input>(
  sources: Array<PipeSource<Input>>,
): GeneratorProvider<Input> {
  for (const next of sources) {
    if (isGeneratorFunction(next)) {
      yield* next();
    } else if (Array.isArray(next)) {
      yield* next;
    } else if (isGeneratorConsumer(next)) {
      yield* next;
    } else {
      yield next;
    }
  }
}
