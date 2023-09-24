import { chainable } from "./chainable";
import { type OperatorGenerator } from "./types.ts";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return Object.getPrototypeOf(source).constructor.name === "GeneratorFunction";
}
export default function pipe<T>(
  ...sources: Array<T | T[] | (() => Generator<T, void, void>)>
) {
  return chainable(
    (function* (): OperatorGenerator<T> {
      for (const next of sources) {
        if (isGeneratorFunction(next)) {
          yield* next();
        } else if (Array.isArray(next)) {
          yield* next;
        } else {
          yield next;
        }
      }
    })(),
  );
}
