import { sleep } from '.'

describe('sleep', () => {
  it('waits', async () => {
    const timeToWait = 10

    const start = Date.now()
    await sleep(timeToWait)
    const end = Date.now()

    expect(end - start).toBeGreaterThanOrEqual(timeToWait)
  })
})
