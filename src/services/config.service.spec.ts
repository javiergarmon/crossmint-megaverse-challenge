import { ConfigService } from '.'

describe('ConfigService', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  it('works - debug defined', () => {
    process.env.DEBUG = 'true'

    const config = new ConfigService()

    expect(config).toMatchObject({
      apiBaseUrl: 'http://example.com',
      candidateId: '1cc7fd20-d65d-4cb0-8041-1a41bc49a54f',
      debug: true,
    })
  })

  it('works - debug undefined', () => {
    process.env.DEBUG = undefined

    const config = new ConfigService()

    expect(config).toMatchObject({
      apiBaseUrl: 'http://example.com',
      candidateId: '1cc7fd20-d65d-4cb0-8041-1a41bc49a54f',
      debug: false,
    })
  })

  it('fails - invalid apiBaseUrl', () => {
    process.env.API_BASE_URL = undefined

    try {
      const config = new ConfigService()
      expect(config).toBeFalsy()
    } catch (err) {
      expect(err).toMatchObject(
        new Error('Env variable API_BASE_URL is not valid')
      )
    }
  })

  it('fails - invalid candidateId', () => {
    process.env.CANDIDATE_ID = undefined

    try {
      const config = new ConfigService()
      expect(config).toBeFalsy()
    } catch (err) {
      expect(err).toMatchObject(
        new Error('Env variable CANDIDATE_ID is not valid')
      )
    }
  })
})
