import { type YieldedProvider } from "../../types.ts";
import { $next, $return } from "../actions.ts";

export function reduce<In, Out = In>(
  reducer: (acc: Out, next: In, index: number) => Out,
  initialValue: Out,
): YieldedProvider<In, Out, Out>;
export function reduce<In>(
  reducer: (acc: In, next: In, index: number) => In,
): YieldedProvider<In, In, In | undefined>;
export function reduce(
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [] | [unknown]
): YieldedProvider<unknown, unknown, unknown> {
  if (!rest.length) {
    return reduceWithoutInitialValue(reducer);
  }
  return reduceWithInitialValue(reducer, rest[0]);
}

function reduceWithInitialValue<In, Out>(
  reducer: (acc: Out, next: In, index: number) => Out,
  initialValue: Out,
): YieldedProvider<In, Out, Out> {
  return () => {
    let index = 0;
    let acc = initialValue;
    return {
      *onNext(next) {
        acc = reducer(acc, next, index++);
      },
      *onDone() {
        yield $next(acc);
        yield $return(acc);
      },
    };
  };
}

export function reduceWithoutInitialValue<In>(
  reducer: (acc: In, next: In, index: number) => In,
): YieldedProvider<In, In, In | undefined> {
  return () => {
    let index = 0;
    return {
      *onNext(first) {
        let acc = first;
        return {
          *onNext(next) {
            acc = reducer(acc, next, index++);
          },
          *onDone() {
            yield $return(acc);
            yield $next(acc);
          },
        };
      },
    };
  };
}
