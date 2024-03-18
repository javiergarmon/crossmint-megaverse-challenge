/**
 * It waits (sleep) as many ms as provided
 * @async
 * @param ms Time to wait in ms
 * @returns Promise<void>
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
