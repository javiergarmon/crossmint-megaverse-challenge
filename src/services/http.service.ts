import { retry } from '../utils'
import { configService } from '.'
import { HttpError } from '../types'
import { type ClassConstructor, plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export type RequestParams = Record<string, unknown>

export class HttpService {
  async get<T extends object>(
    path: string,
    cls?: ClassConstructor<unknown>
  ): Promise<T> {
    const url = this.url(path)
    const res = await fetch(url).catch((err) => {
      throw new Error(`GET ${url} failed. ${err}`)
    })

    if (!res.ok) {
      throw new HttpError(res)
    }

    const body = await res.json()

    if (cls) {
      const result = plainToInstance(cls, body) as T
      await validateOrReject(result)
      return result
    }

    return body
  }

  async post(path: string, params?: RequestParams): Promise<void> {
    const url = this.url(path)
    const res = await retry(
      async () =>
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        }).catch((err) => {
          throw new Error(`POST ${url} failed. ${err}`)
        })
    )

    if (!res.ok) {
      throw new HttpError(res)
    }
  }

  async remove(path: string, params?: RequestParams): Promise<void> {
    const url = this.url(path)
    const res = await retry(
      async () =>
        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        }).catch((err) => {
          throw new Error(`DELETE ${url} failed. ${err}`)
        })
    )

    if (!res.ok) {
      throw new HttpError(res)
    }
  }

  private url(path: string): string {
    const url = new URL(configService.apiBaseUrl)
    url.pathname = `${url.pathname}${path}`
      // To prevent double /
      .replace(/^\/+|\/+$/g, '')
      .replace(/\/+/g, '/')
    return url.toString()
  }
}

export const httpService = new HttpService()
