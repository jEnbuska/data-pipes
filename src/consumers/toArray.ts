import { type PipeSource, type AsyncPipeSource } from "../types.ts";
import { invoke } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function toArray<TInput>(
  source: PipeSource<TInput>,
  signal = new AbortController().signal,
): TInput[] {
  const acc: TInput[] = [];
  if (!signal) return acc;
  for (const next of source()) {
    if (signal.aborted) return [];
    acc.push(next);
  }
  return acc;
}

export async function toArrayAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  signal = new AbortController().signal,
): Promise<TInput[]> {
  const acc: TInput[] = [];
  const resolvable = await createResolvable<TInput[]>();
  if (signal.aborted) return [];
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    invoke(async function () {
      for await (const next of source()) {
        if (signal.aborted) return [];
        acc.push(next);
      }
      return acc;
    }),
  ]);
}
export function toArrayFromReturn<TInput>(
  source: PipeSource<TInput, TInput[]>,
  signal = new AbortController().signal,
): TInput[] {
  const generator = source();
  let result = generator.next();
  while (true) {
    if (signal.aborted) return [];
    if (result.done) return result.value;
    result = generator.next();
  }
}

export async function toArrayAsyncFromReturn<TInput>(
  source: AsyncPipeSource<TInput, TInput[]>,
  signal = new AbortController().signal,
): Promise<TInput[]> {
  const resolvable = await createResolvable<TInput[]>();
  if (signal.aborted) return [];
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    invoke(async function () {
      const generator = source();
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value;
        result = await generator.next();
      }
    }),
  ]);
}
