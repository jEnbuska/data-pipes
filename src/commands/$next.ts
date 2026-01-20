export type NextPayload = {
  type: "$next";
};

export function* $next<TIn>(): Generator<NextPayload, TIn, TIn> {
  return yield { type: "$next" };
}
