import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function map<TInput, TOutput>(
  source: PipeSource<TInput>,
  mapper: (next: TInput) => TOutput,
): PipeSource<TOutput> {
  return function* mapGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncPipeSource<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncPipeSource<Awaited<TOutput>> {
  return async function* mapAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
