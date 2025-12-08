import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function max<TInput>(
  source: ProviderFunction<TInput>,
  callback: (next: TInput) => number,
): ProviderFunction<TInput> {
  return function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = disposable(source);
    for (const next of generator) {
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
  source: AsyncProviderFunction<TInput>,
  callback: (next: TInput) => number,
): AsyncProviderFunction<TInput> {
  return async function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = disposable(source);
    for await (const next of generator) {
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
