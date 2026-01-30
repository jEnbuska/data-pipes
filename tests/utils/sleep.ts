export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function delay<T>(value: T, ms: number): Promise<T> {
  await sleep(ms);
  return value;
}
