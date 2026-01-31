export function sleep(ms = 0) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function delay<T>(value: T, ms: number): Promise<T> {
  await sleep(ms);
  return value;
}
