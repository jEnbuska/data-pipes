import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function resolve<TInput>(
  source: PipeSource<TInput>,
): AsyncPipeSource<TInput extends Promise<infer U> ? U : TInput> {
  return async function* resolveGenerator(signal) {
    for await (const next of source(signal)) {
      yield next as any;
    }
  };
}
