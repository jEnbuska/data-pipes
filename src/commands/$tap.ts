type TapCallback<TIn> = (value: TIn) => any;
type TapPayload<TIn> = {
  type: "$tap";
  value: TapCallback<TIn>;
};
function* $tap<TIn>(
  callback: TapCallback<TIn>,
): Generator<TapPayload<TIn>, void, void> {
  return yield { type: "$tap", value: callback };
}
