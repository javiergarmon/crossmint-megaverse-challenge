import { configService } from '.'

class LoggerService {
  debug(...args: unknown[]): void {
    configService.debug && console.log(...args)
  }

  info(...args: unknown[]): void {
    console.log(...args)
  }

  error(...args: unknown[]): void {
    console.error(...args)
  }
}

export const loggerService = new LoggerService()
