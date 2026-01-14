import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function maxSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): SyncYieldedProvider<TInput> {
  return function* maxSyncGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalYielded.disposable(source);
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
