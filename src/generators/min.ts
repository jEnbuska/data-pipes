import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function min<TInput>(
  source: PipeSource<TInput>,
  callback: (next: TInput) => number,
): PipeSource<TInput> {
  return function* minGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    for (const next of source(signal)) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}
export function minAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  callback: (next: TInput) => number,
): AsyncPipeSource<TInput> {
  return async function* minAsyncGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}
