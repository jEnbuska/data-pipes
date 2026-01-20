export type NextPayload<TOut> = {
  type: "$push";
  out: TOut;
};

export function* $push<TOut>(
  out: TOut,
): Generator<NextPayload<TOut>, void, void> {
  yield { type: "$push", out };
}
