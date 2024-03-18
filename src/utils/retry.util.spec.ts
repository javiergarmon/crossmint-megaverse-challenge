import { retry } from '.'

describe('retry', () => {
  it('works', async () => {
    const fn = jest.fn(async () => ({ status: 200 }) as Response)

    await retry(fn as () => Promise<Response>)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries', async () => {
    const fn = jest.fn()

    fn.mockResolvedValueOnce({ status: 429 } as Response)
    fn.mockResolvedValueOnce({ status: 200 } as Response)

    const start = Date.now()
    await retry(fn as () => Promise<Response>, { incrementWait: 10 })
    const end = Date.now()

    expect(fn).toHaveBeenCalledTimes(2)
    expect(end - start).toBeGreaterThanOrEqual(10)
  })

  it('fails', async () => {
    const fn = jest.fn(async () => ({ status: 400 }) as Response)

    await retry(fn as () => Promise<Response>)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('fails in a retry', async () => {
    const fn = jest.fn()

    fn.mockResolvedValueOnce({ status: 429 } as Response)
    fn.mockResolvedValueOnce({ status: 400 } as Response)

    const start = Date.now()
    await retry(fn as () => Promise<Response>, { incrementWait: 10 })
    const end = Date.now()

    expect(fn).toHaveBeenCalledTimes(2)
    expect(end - start).toBeGreaterThanOrEqual(10)
  })

  it('exhausts retries', async () => {
    const fn = jest.fn()

    fn.mockResolvedValueOnce({ status: 429 } as Response)
    fn.mockResolvedValueOnce({ status: 429 } as Response)
    fn.mockResolvedValueOnce({ status: 200 } as Response)

    const start = Date.now()
    await retry(fn as () => Promise<Response>, {
      incrementWait: 10,
      maxAttemps: 2,
    })
    const end = Date.now()

    expect(fn).toHaveBeenCalledTimes(2)
    expect(end - start).toBeGreaterThanOrEqual(20)
  })
})
