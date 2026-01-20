type DefaultToCallback<TDefault> = () => TDefault;

type DefaultToPayload<TDefault> = {
  $defaultTo: TDefault;
};
function* $defaultTo<TDefault>(
  getDefault: TDefault,
): Generator<DefaultToPayload<TDefault>, void, void> {
  return yield { $defaultTo: getDefault };
}

type MapCallback<TIn, TOut> = (value: TIn) => TOut;
type MapPayload<TIn, TOut> = {
  $map: MapCallback<TIn, TOut>;
};

function* $map<TIn, TOut>(
  mapper: (value: TIn) => TOut,
): Generator<MapPayload<TIn, TOut>, TOut, TOut> {
  return yield { $map: mapper };
}

type FlatMapCallback<TIn, TOut> = (value: TIn) => TOut | readonly TOut[];
type FlatMapPayload<TIn, TOut> = {
  $flatMap: FlatMapCallback<TIn, TOut>;
};

function* $flatMap<TIn, TOut>(
  flatMapper: FlatMapCallback<TIn, TOut>,
): Generator<FlatMapPayload<TIn, TOut>, TOut, TOut> {
  return yield { $flatMap: flatMapper };
}

type TapPayload<TIn> = {
  $tap: (value: TIn) => any;
};
function* $tap<TIn>(
  callback: (value: TIn) => any,
): Generator<TapPayload<TIn>, void, void> {
  return yield { $tap: callback };
}

type EndPayload = {
  $end: true;
};
function* $end(): Generator<EndPayload, void, void> {
  yield { $end: true };
  throw new Error("$end command was incorrectly resolved");
}
