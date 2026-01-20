type FilterCallback<TIn> = (value: TIn) => boolean | Promise<boolean>;
export type FilterPayload<TIn> = {
  type: "$filter";
  value: FilterCallback<TIn>;
};

export function* $filter<TAsync, TIn>(toAwaited: TAsync) {
  return function* (
    predicate: FilterCallback<TIn>,
  ): Generator<FilterPayload<TIn>, TIn, TIn> {
    return yield { type: "$filter", value: predicate, toAwaited };
  };
}
