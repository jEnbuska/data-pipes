import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): SyncYieldedProvider<TOutput>;
export function filterSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): SyncYieldedProvider<TInput>;
export function filterSync(
  source: SyncYieldedProvider<unknown>,
  predicate: (next: unknown) => unknown,
): SyncYieldedProvider<unknown> {
  return function* filterSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncYieldedProvider<Awaited<TOutput>>;
export function filterAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): AsyncYieldedProvider<Awaited<TInput>>;
export function filterAsync(
  source: AsyncYieldedProvider<unknown>,
  predicate: (next: unknown) => any,
): AsyncYieldedProvider<unknown> {
  return async function* filterAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}
