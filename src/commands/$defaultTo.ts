export type DefaultToPayload<TOut> = {
  type: "$defaultTo";
  value: () => TOut;
};

export function* $defaultTo<TOut>(
  getDefault: () => TOut,
): Generator<DefaultToPayload<TOut>, void, void> {
  yield { type: "$defaultTo", value: getDefault };
}
