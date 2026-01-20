export type ResolvePayload<TOut> = {
  type: "$await";
  value: Promise<TOut>;
};

export function* $await<TArgs extends any[], TOut>(
  callback: (...args: TArgs) => Promise<TOut> | TOut,
  ...args: TArgs
): Generator<ResolvePayload<TOut>, Awaited<TOut>, Awaited<TOut>> {
  const data = callback(...args);
  if (data && data instanceof Promise) {
    return yield { type: "$await", value: data };
  }
  return data as Awaited<TOut>;
}
