import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function max<TInput>(
  source: PipeSource<TInput>,
  callback: (next: TInput) => number,
): PipeSource<TInput> {
  return function* maxGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    for (const next of source(signal)) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}

export function maxAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  callback: (next: TInput) => number,
): AsyncPipeSource<TInput> {
  return async function* maxGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}
