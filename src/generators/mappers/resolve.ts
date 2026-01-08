import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function resolve<TInput>(
  source: ProviderFunction<TInput>,
): AsyncProviderFunction<TInput extends Promise<infer U> ? U : TInput> {
  return async function* resolveGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      yield next as any;
    }
  };
}
