export const PLACEHOLDER = Symbol("PLACEHOLDER");

export function isPlaceholder<T>(value: T | symbol): value is symbol {
  return value === PLACEHOLDER;
}
export function getPlaceholder() {
  return PLACEHOLDER;
}
