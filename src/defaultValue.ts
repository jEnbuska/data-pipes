import type { DefaultValue } from "./types.ts";

export function defaultValue<TDefault>(
  getDefault: () => TDefault,
): DefaultValue<TDefault> {
  return {
    _yieldedDefault: getDefault,
  };
}
