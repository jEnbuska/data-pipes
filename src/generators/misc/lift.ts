import { defineOperator } from "../../defineOperator.ts";
import type {
  AsyncOperatorGenerator,
  AsyncOperatorResolver,
  SyncOperatorGenerator,
  SyncOperatorResolver,
} from "../../types.ts";

export function liftSync<TArgs extends any[], TIn, TNext>(
  middleware: (
    resolver: SyncOperatorResolver<TArgs, TIn, TNext>,
  ) => SyncOperatorGenerator<TNext>,
): SyncOperatorResolver<TArgs, TIn, TNext> {
  return function* liftSyncResolver(...args) {
    yield* (middleware as any)(...args);
  };
}

export function liftAsync<TArgs extends any[], TIn, TNext>(
  middleware: (
    resolver: AsyncOperatorResolver<TArgs, TIn, TNext>,
  ) => AsyncOperatorGenerator<TNext>,
): AsyncOperatorResolver<TArgs, TIn, TNext> {
  return async function* liftAsyncResolver(...args) {
    for await (const next of (middleware as any)(...args)) {
      yield next;
    }
  };
}

export default defineOperator({
  name: "lift",
  liftAsync,
  liftSync,
});
