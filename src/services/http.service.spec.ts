import { HttpError } from '../types'
import { httpService } from '.'
import { MapGoalResponse } from '../models'

const apiBaseUrl = process.env.API_BASE_URL
const fetchMock = jest.fn()
global.fetch = fetchMock

describe('HttpService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('get', () => {
    it('works - without transforming', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ meaning: 42 }),
      })

      const result = await httpService.get(
        `meaning-of-life-the-universe-and-everything-else`
      )

      expect(result).toMatchObject({ meaning: 42 })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        `${apiBaseUrl}/meaning-of-life-the-universe-and-everything-else`
      )
    })

    it('works - transforming to class', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          goal: [['POLYANET', 'BLUE_SOLOON', 'UP_COMETH', 'SPACE']],
        }),
      })

      const result = await httpService.get<MapGoalResponse>(
        `amazing-goal-map`,
        MapGoalResponse
      )

      expect(result).toMatchObject({
        goal: [['POLYANET', 'BLUE_SOLOON', 'UP_COMETH', 'SPACE']],
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/amazing-goal-map`)
    })

    it('fails - fetch fails', async () => {
      fetchMock.mockRejectedValue(new Error('Network disconnected'))

      await expect(
        httpService.get(`meaning-of-life-the-universe-and-everything-else`)
      ).rejects.toThrow(
        new Error(
          'GET http://example.com/meaning-of-life-the-universe-and-everything-else failed. Error: Network disconnected'
        )
      )

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        `${apiBaseUrl}/meaning-of-life-the-universe-and-everything-else`
      )
    })

    it('fails - bad response code', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 400 })

      await expect(
        httpService.get(`meaning-of-life-the-universe-and-everything-else`)
      ).rejects.toThrow(new HttpError({ status: 400 } as Response))

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        `${apiBaseUrl}/meaning-of-life-the-universe-and-everything-else`
      )
    })

    it('fails - transforming to class', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          goal: [['WEIRD_POLYANET', 'SOLOON', 42, null]],
        }),
      })

      try {
        await httpService.get<MapGoalResponse>(
          `amazing-goal-map`,
          MapGoalResponse
        )
      } catch (err) {
        expect(err).toMatchObject([
          {
            constraints: {
              isRawMap:
                'goal must be a 2D array of RawAstralObjectType values with rows with the same length',
            },
          },
        ])
      }
    })
  })

  describe('post', () => {
    it('works', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
      })

      await httpService.post(`terraform`, { waterPlanet: false })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/terraform`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: '{"waterPlanet":false}',
      })
    })

    it('fails - fetch fails', async () => {
      fetchMock.mockRejectedValue(new Error('Network disconnected'))

      await expect(
        httpService.post(`terraform`, {
          waterPlanet: false,
        })
      ).rejects.toThrow(
        new Error(
          'POST http://example.com/terraform failed. Error: Network disconnected'
        )
      )

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/terraform`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: '{"waterPlanet":false}',
      })
    })

    it('fails - bad response code', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 400 })

      await expect(
        httpService.post(`terraform`, {
          waterPlanet: false,
        })
      ).rejects.toThrow(new HttpError({ status: 400 } as Response))

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/terraform`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: '{"waterPlanet":false}',
      })
    })
  })

  describe('delete', () => {
    it('works', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
      })

      await httpService.remove(`whale`, { isFlying: true })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/whale`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: '{"isFlying":true}',
      })
    })

    it('fails - fetch fails', async () => {
      fetchMock.mockRejectedValue(new Error('Network disconnected'))

      await expect(
        httpService.remove(`whale`, {
          isFlying: true,
        })
      ).rejects.toThrow(
        new Error(
          'DELETE http://example.com/whale failed. Error: Network disconnected'
        )
      )

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/whale`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: '{"isFlying":true}',
      })
    })

    it('fails - bad response code', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 400 })

      await expect(
        httpService.remove(`whale`, {
          isFlying: true,
        })
      ).rejects.toThrow(new HttpError({ status: 400 } as Response))

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/whale`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: '{"isFlying":true}',
      })
    })
  })
})
