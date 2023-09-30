import {
  type GeneratorMiddleware,
  type GeneratorConsumer,
  type PipeSource,
} from "./types.ts";
import { toArray, toConsumer, toSingle, toGenerator } from "./consumers";
import { map, filter, unflat, flat, reduce } from "./generators";

export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
  middleware11: GeneratorMiddleware<J, K>,
  middleware12: GeneratorMiddleware<K, L>,
  middleware13: GeneratorMiddleware<L, M>,
  middleware14: GeneratorMiddleware<M, N>,
  middleware15: GeneratorMiddleware<N, O>,
): GeneratorConsumer<O>;
export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
  middleware11: GeneratorMiddleware<J, K>,
  middleware12: GeneratorMiddleware<K, L>,
  middleware13: GeneratorMiddleware<L, M>,
  middleware14: GeneratorMiddleware<M, N>,
): GeneratorConsumer<N>;
export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L, M>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
  middleware11: GeneratorMiddleware<J, K>,
  middleware12: GeneratorMiddleware<K, L>,
  middleware13: GeneratorMiddleware<L, M>,
): GeneratorConsumer<M>;
export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
  middleware11: GeneratorMiddleware<J, K>,
  middleware12: GeneratorMiddleware<K, L>,
): GeneratorConsumer<L>;
export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
  middleware11: GeneratorMiddleware<J, K>,
): GeneratorConsumer<K>;
export function pipe<Input, A, B, C, D, E, F, G, H, I, J>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
  middleware10: GeneratorMiddleware<I, J>,
): GeneratorConsumer<J>;

export function pipe<Input, A, B, C, D, E, F, G, H, I>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
): GeneratorConsumer<I>;
export function pipe<Input, A, B, C, D, E, F, G, H>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
): GeneratorConsumer<H>;
export function pipe<Input, A, B, C, D, E, F, G>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
): GeneratorConsumer<G>;
export function pipe<Input, A, B, C, D, E, F>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
): GeneratorConsumer<F>;
export function pipe<Input, A, B, C, D, E>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
): GeneratorConsumer<E>;
export function pipe<Input, A, B, C, D>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
): GeneratorConsumer<D>;
export function pipe<Input, A, B, C>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
): GeneratorConsumer<C>;
export function pipe<Input, A, B>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
): GeneratorConsumer<B>;
export function pipe<Input, A>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
): GeneratorConsumer<A>;

export function pipe(
  input: any,
  ...middlewares: Array<GeneratorMiddleware<any, any>>
): GeneratorConsumer<unknown> {
  const generator: any = {};
  return {
    toArray() {
      return toArray()(generator);
    },
    toConsumer() {
      return toConsumer()(generator);
    },
    toSingle(...args: [never] | []) {
      return toSingle<unknown, unknown>(...args)(generator);
    },
    toGenerator() {
      return toGenerator()(generator);
    },
  };
}

const value = pipe(
  1,
  map((x) => x + 1),
  map((x) => ({ x })),
  filter((next) => next.x > 1),
  map((next) => next.x),
  map(String),
  unflat(),
  flat(),
  reduce((acc, next) => [...acc, ...next], [] as string[]),
  map((next) => next.length),
).toSingle("hello");
