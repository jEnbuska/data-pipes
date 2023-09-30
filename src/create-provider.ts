import { type GeneratorProvider, type PipeSource } from "./types.ts";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

export function* createProvider<Input>(
  sources: Array<PipeSource<Input>>,
): GeneratorProvider<Input> {
  for (const next of sources) {
    if (isGeneratorFunction(next)) {
      yield* next();
    } else if (Array.isArray(next)) {
      yield* next;
    } else {
      yield next;
    }
  }
}
