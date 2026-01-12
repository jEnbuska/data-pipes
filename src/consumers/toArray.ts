import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../types";
import { InternalStreamless } from "../utils";

export function toArray<TInput>(
  source: StreamlessProvider<TInput>,
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
  source: AsyncStreamlessProvider<TInput>,
  signal = new AbortController().signal,
): Promise<TInput[]> {
  const acc: TInput[] = [];
  const resolvable = Promise.withResolvers<TInput[]>();
  if (signal.aborted) return [];
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    InternalStreamless.invoke(async function () {
      for await (const next of source()) {
        if (signal.aborted) return [];
        acc.push(next);
      }
      return acc;
    }),
  ]);
}
export function toArrayFromReturn<TInput>(
  source: StreamlessProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): TInput[] {
  const generator = source();
  let result = generator.next();
  while (true) {
    if (signal.aborted) return [];
    if (result.done) return result.value ?? [];
    /* Don't create a new list since the list is return's the list as is */
    result = generator.next();
  }
}

export async function toArrayAsyncFromReturn<TInput>(
  source: AsyncStreamlessProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): Promise<TInput[]> {
  const resolvable = Promise.withResolvers<TInput[]>();
  if (signal.aborted) return [];
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    InternalStreamless.invoke(async function () {
      const generator = source();
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value ?? [];
        result = await generator.next();
      }
    }),
  ]);
}
