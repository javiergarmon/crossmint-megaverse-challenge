import { loggerService } from '.'

jest.mock('./config.service', () => {
  let requested = 0

  return {
    configService: {
      get debug() {
        return ++requested % 2
      },
    },
  }
})

describe('LoggerService', () => {
  const logSpy = jest.spyOn(console, 'log')
  const errorSpy = jest.spyOn(console, 'error')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('debug', () => {
    it('enabled', () => {
      loggerService.debug('debug enabled')

      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith('debug enabled')
    })

    it('disabled', () => {
      loggerService.debug('debug disabled')

      expect(logSpy).not.toHaveBeenCalled()
    })
  })

  it('info', () => {
    loggerService.info('hello world')

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('hello world')
  })

  it('error', () => {
    loggerService.error('bad bug')

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith('bad bug')
  })
})
