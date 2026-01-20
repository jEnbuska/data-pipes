type FlatMapCallback<TIn, TOut> = (value: TIn) => TOut | readonly TOut[];
type FlatMapPayload<TIn, TOut> = {
  type: "$flatMap";
  value: FlatMapCallback<TIn, TOut>;
};

function* $flatMap<TIn, TOut>(
  callback: FlatMapCallback<TIn, TOut>,
): Generator<FlatMapPayload<TIn, TOut>, TOut, TOut> {
  return yield { type: "$flatMap", value: callback };
}
