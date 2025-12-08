import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function resolve<TInput>(
  source: ProviderFunction<TInput>,
): AsyncProviderFunction<TInput extends Promise<infer U> ? U : TInput> {
  return async function* resolveGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      yield next as any;
    }
  };
}
