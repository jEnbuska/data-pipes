import {OperatorGenerator} from "../operators/types.ts";

export function toGenerator<T>(generator: OperatorGenerator<T>): Generator<T> {
    return generator(() => false);
}