import {
  type PipeSource,
  type GeneratorMiddleware,
  type GeneratorConsumable,
} from "../types.ts";
import { createProvider } from "../create-provider.ts";
import { createConsumable } from "../create-consumable.ts";

export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
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
  middleware16: GeneratorMiddleware<O, P>,
  middleware17: GeneratorMiddleware<P, Q>,
): GeneratorConsumable<Q>;

export function pipe<Input, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
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
  middleware16: GeneratorMiddleware<O, P>,
): GeneratorConsumable<P>;

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
): GeneratorConsumable<O>;

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
): GeneratorConsumable<N>;

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
): GeneratorConsumable<M>;

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
): GeneratorConsumable<L>;

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
): GeneratorConsumable<K>;

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
): GeneratorConsumable<J>;

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
): GeneratorConsumable<I>;

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
): GeneratorConsumable<H>;

export function pipe<Input, A, B, C, D, E, F, G>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
): GeneratorConsumable<G>;

export function pipe<Input, A, B, C, D, E, F>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
): GeneratorConsumable<F>;

export function pipe<Input, A, B, C, D, E>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
): GeneratorConsumable<E>;

export function pipe<Input, A, B, C, D>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
): GeneratorConsumable<D>;

export function pipe<Input, A, B, C>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
): GeneratorConsumable<C>;

export function pipe<Input, A, B>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
  middleware2: GeneratorMiddleware<A, B>,
): GeneratorConsumable<B>;

export function pipe<Input, A>(
  source: PipeSource<Input>,
  middleware1: GeneratorMiddleware<Input, A>,
): GeneratorConsumable<A>;

export function pipe<Input>(
  source: PipeSource<Input>,
): GeneratorConsumable<Input>;

export function pipe(...args: unknown[]): GeneratorConsumable<unknown> {
  const [source, ...middlewares] = args;
  const generator = middlewares.reduce(
    (acc, next) => (next as any)(acc),
    createProvider([source]),
  );
  return createConsumable(generator as any);
}
