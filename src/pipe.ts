import { type AsyncPipe } from "./asyncChainable.ts";
import {
  type AsyncOperatorGenerator,
  type OperatorGenerator,
} from "./operators/types.ts";
import { type Chainable, chainable } from "./chainable.ts";

type PipeReturnValue<T> = T extends OperatorGenerator<infer Item>
  ? Chainable<Item>
  : T extends Array<infer Item> ? Chainable<Item>
  : T extends AsyncOperatorGenerator<infer Item> ? AsyncPipe<Item>
  : Chainable<T>;

function isGeneratorFunction(
  source: unknown,
): source is OperatorGenerator<unknown> {
  return Object.getPrototypeOf(source).constructor.name === "GeneratorFunction";
}
/*
function isAsyncGeneratorFunction(
  source: unknown,
): source is AsyncOperatorGenerator<unknown> {
  return (
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
} */

function isArray(source: unknown): source is unknown[] {
  return Array.isArray(source);
}

export function fromSingle<T>(source: T): Chainable<T> {
  return chainable(function* () {
    yield source;
  });
}
/*
function fromAsyncGeneratorFunction<T>(
  source: AsyncOperatorGenerator<T>,
): AsyncPipe<T> {
  console.log("fROM ASYNC GENEARTOR FUNCTION");
  return {} as any;
  // return pipeFromAsyncIterableIterator(source);
} */

export function fromArray<T>(source: T[]): Chainable<T> {
  return chainable(function* () {
    for (const next of source) {
      yield next;
    }
  });
}
function pipe<T>(source: T): PipeReturnValue<T> {
  if (isGeneratorFunction(source)) {
    return chainable(source) as PipeReturnValue<T>;
  }
  if (isArray(source)) {
    return fromArray(source) as PipeReturnValue<T>;
  }
  /* if (isAsyncGeneratorFunction(source)) {
    return fromAsyncGeneratorFunction(source);
  } */
  return fromSingle(source) as PipeReturnValue<T>;
}

pipe.array = fromSingle;
pipe.single = fromArray;
pipe.fromGeneratorFunction = chainable;
// pipe.fromAsyncGeneratorFunction = fromAsyncGeneratorFunction;

console.log("pipe imported");
export default pipe;
