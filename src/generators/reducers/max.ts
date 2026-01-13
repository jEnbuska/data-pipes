import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function max<TInput>(
  source: SyncStreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): SyncStreamlessProvider<TInput> {
  return function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalStreamless.disposable(source);
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
  source: AsyncStreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncStreamlessProvider<TInput> {
  return async function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalStreamless.disposable(source);
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
