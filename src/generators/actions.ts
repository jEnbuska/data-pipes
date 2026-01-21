type NextAction<T> = { type: "$NEXT"; payload: T };
export function $next<Out>(payload: Out): NextAction<Out> {
  return { type: "$NEXT", payload };
}

type NextFlatAction<T extends any[]> = { type: "$NEXT_FLAT"; payload: T };
export function $nextFlat<Out extends any[]>(
  payload: Out,
): NextFlatAction<Out> {
  return { type: "$NEXT_FLAT", payload };
}

type ExitAction = { type: "$DONE" };
export function $done(): ExitAction {
  return { type: "$DONE" };
}

type ReturnAction<T> = { type: "$RETURN"; payload: T };
export function $return<Return>(payload: Return): ReturnAction<Return> {
  return { type: "$RETURN", payload };
}

type ReturnFlatAction<Return extends any[]> = {
  type: "$RETURN_FLAT";
  payload: Return;
};
export function $returnFlat<Return extends any[]>(
  payload: Return,
): ReturnFlatAction<Return> {
  return { type: "$RETURN_FLAT", payload };
}

type AwaitAction<T> = { type: "$AWAIT"; payload: T };
export function* $await<T>(
  payload: T,
): Generator<AwaitAction<T>, Awaited<T>, Awaited<T>> {
  return yield { type: "$AWAIT", payload };
}

export type OnDoneAction<Out, Return = never> =
  | NextAction<Out>
  | NextFlatAction<Out[]>
  | ReturnAction<Return>
  | ReturnFlatAction<Out[]>
  | AwaitAction<any>;
export type OnNextAction<Out> =
  | NextAction<Out>
  | NextFlatAction<Out[]>
  | ExitAction
  | AwaitAction<any>;
