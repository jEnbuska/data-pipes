import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function min<TInput>(
  source: ProviderFunction<TInput>,
  callback: (next: TInput) => number,
): ProviderFunction<TInput> {
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
  source: AsyncProviderFunction<TInput>,
  callback: (next: TInput) => number,
): AsyncProviderFunction<TInput> {
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
