import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function countBySync<TInput>(
  source: SyncYieldedProvider<TInput>,
  mapper: (next: TInput) => number,
): SyncYieldedProvider<number> {
  return function* countSyncByGenerator() {
    let acc = 0;
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  mapper: (next: TInput) => number,
): AsyncYieldedProvider<number> {
  return async function* countByAsyncGenerator() {
    let acc = 0;
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
