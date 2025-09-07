import {
  type SyncPipeSource,
  type GeneratorMiddleware,
  type GeneratorConsumable,
} from "../types.ts";
import { createProvider } from "../create-provider.ts";
import { createConsumable } from "../create-consumable.ts";

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */

export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L, M>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K, L>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J, K>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I, J>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
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

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H, I>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
  middleware9: GeneratorMiddleware<H, I>,
): GeneratorConsumable<I>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G, H>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
  middleware8: GeneratorMiddleware<G, H>,
): GeneratorConsumable<H>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F, G>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
  middleware7: GeneratorMiddleware<F, G>,
): GeneratorConsumable<G>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E, F>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
  middleware6: GeneratorMiddleware<E, F>,
): GeneratorConsumable<F>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D, E>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
  middleware5: GeneratorMiddleware<D, E>,
): GeneratorConsumable<E>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C, D>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
  middleware4: GeneratorMiddleware<C, D>,
): GeneratorConsumable<D>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B, C>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
  middleware3: GeneratorMiddleware<B, C>,
): GeneratorConsumable<C>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A, B>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
  middleware2: GeneratorMiddleware<A, B>,
): GeneratorConsumable<B>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput, A>(
  source: SyncPipeSource<TInput>,
  middleware1: GeneratorMiddleware<TInput, A>,
): GeneratorConsumable<A>;

/**
 * Creates a pipe that can be used for composing generators
 * @example
 * pipe(
 *  [1,2,3],
 *  map(n => n * 2),
 *  filter(n => n > 2),
 * ).toArray() // [4,6]
 *
 * @example
 * pipe(
 *  1,
 *  map(n => n * 2),
 * ).first() // 2
 *
 * @example
 * pipe(
 *  pipe([1,2,3]).map(n => n * 2),
 *  map(n => n * 2),
 * ).toArray() // [4,8,12]
 * */
export function pipe<TInput>(
  source: SyncPipeSource<TInput>,
): GeneratorConsumable<TInput>;

export function pipe(...args: unknown[]): GeneratorConsumable<unknown> {
  const [source, ...middlewares] = args;
  const generator = middlewares.reduce(
    (acc, next) => (next as any)(acc),
    createProvider(source),
  );
  return createConsumable(generator as any);
}
