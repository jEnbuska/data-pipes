type ReduceCallback<TIn, TOut> = (acc: TOut, value: TIn) => TOut;
type ReducePayload<TIn, TOut> = {
  type: "$skipWhile";
  callback: ReduceCallback<TIn, TOut>;
  initial: TOut;
};
function* $reduce<TIn, TOut>(
  callback: ReduceCallback<TIn, TOut>,
  initial: TOut,
): Generator<ReducePayload<TIn, TOut>, void, void> {
  return yield { type: "$skipWhile", callback, initial };
}
