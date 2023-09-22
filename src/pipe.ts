import { type Chainable, chainable } from "./chainable.ts";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return Object.getPrototypeOf(source).constructor.name === "GeneratorFunction";
}
function isArray(source: unknown): source is unknown[] {
  return Array.isArray(source);
}
export default function pipe<T>(
  ...sources: Array<T | T[] | (() => Generator<T, void, void>)>
): Chainable<T> {
  return chainable(function* () {
    for (const next of sources) {
      if (isGeneratorFunction(next)) {
        yield* next();
      } else if (isArray(next)) {
        yield* next;
      } else {
        yield next;
      }
    }
  });
}
