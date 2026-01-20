import { $await } from "./$await.ts";
import { $next } from "./$next.ts";

export function getCommands<TIn>(toAwaited: boolean) {
  return {
    $next: () => $next<TIn>(toAwaited),
    $resolve: <TData>(data: TData) => $await(toAwaited, data),
  };
}
