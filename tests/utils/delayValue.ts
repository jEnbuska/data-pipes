export async function delayValue<T>(value: T, ms: number): Promise<T> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  return value;
}
