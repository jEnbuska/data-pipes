import { type PipeSource, type AsyncPipeSource } from "../types.ts";
import { invoke } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function toArray<TInput>(
  source: PipeSource<TInput>,
  signal = new AbortController().signal,
): TInput[] {
  const acc: TInput[] = [];
  if (signal.aborted) return acc;
  for (const next of source(signal)) {
    if (signal.aborted) return acc;
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
  if (signal?.aborted) {
    return Promise.resolve(acc);
  }
  signal?.addEventListener("abort", () => resolvable.resolve(acc));
  return Promise.race([
    resolvable.promise,
    invoke(async function () {
      for await (const next of source(signal)) {
        if (signal?.aborted) {
          return resolvable.promise;
        }
        acc.push(next);
      }
      return acc;
    }),
  ]);
}
