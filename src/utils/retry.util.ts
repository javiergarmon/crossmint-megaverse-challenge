import { loggerService } from '../services'
import { sleep } from '.'

interface RetryOptions {
  maxAttemps?: number
  incrementWait?: number
  maxWait?: number
}

export async function retry(
  action: () => Promise<Response>,
  options?: RetryOptions
): Promise<Response> {
  const maxAttemps = options?.maxAttemps ?? 10
  const incrementWait = options?.incrementWait ?? 250
  const maxWait = options?.maxWait ?? 5000
  let res

  for (let tryAttempt = 1; tryAttempt <= maxAttemps; tryAttempt++) {
    res = await action()

    if (res.status !== 429) {
      return res
    }

    if (tryAttempt < maxAttemps) {
      const waitTime = Math.min((tryAttempt + 1) * incrementWait, maxWait)

      loggerService.debug(`[retry] wait ${waitTime} ms`)
      await sleep(waitTime)
    }
  }

  return res
}
