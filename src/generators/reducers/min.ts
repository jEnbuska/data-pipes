import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function min<TInput>(
  source: PipeSource<TInput>,
  callback: (next: TInput) => number,
): PipeSource<TInput> {
  return function* minGenerator() {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = disposable(source);
    for (const next of generator) {
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
  return async function* minAsyncGenerator() {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = disposable(source);
    for await (const next of generator) {
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
