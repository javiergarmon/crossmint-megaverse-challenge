import { getRandomverse } from '../utils'
import { httpService, megaverseService } from '.'
import { type Soloon, type Cometh, MapGoalResponse } from '../models'

jest.mock('./http.service')

const candidateId = process.env.CANDIDATE_ID

describe('Megaverse', () => {
  const httpServiceMock = {
    get: jest.spyOn(httpService, 'get'),
    post: jest.spyOn(httpService, 'post'),
    remove: jest.spyOn(httpService, 'remove'),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getGoalMap', () => {
    it('gets a 0x0 map', async () => {
      httpServiceMock.get.mockResolvedValue({ goal: [] })

      const goalMap = await megaverseService.getGoalMap()

      expect(goalMap).toMatchObject({})
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1)
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        `map/1cc7fd20-d65d-4cb0-8041-1a41bc49a54f/goal`,
        MapGoalResponse
      )
    })

    it('gets a 1x1 map', async () => {
      httpServiceMock.get.mockResolvedValue({ goal: [['POLYANET']] })

      const goalMap = await megaverseService.getGoalMap()
      const entries = [...goalMap.entries()]

      expect(entries).toMatchObject([
        [{ row: 0, column: 0 }, { type: 'polyanets' }],
      ])
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1)
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        `map/1cc7fd20-d65d-4cb0-8041-1a41bc49a54f/goal`,
        MapGoalResponse
      )
    })

    it('gets a 3x2 map', async () => {
      httpServiceMock.get.mockResolvedValue({
        goal: [
          ['BLUE_SOLOON', 'SPACE', 'SPACE'],
          ['SPACE', 'POLYANET', 'LEFT_COMETH'],
        ],
      })

      const goalMap = await megaverseService.getGoalMap()
      const entries = [...goalMap.entries()]

      expect(entries).toMatchObject([
        [
          { row: 0, column: 0 },
          { type: 'soloons', color: 'blue' },
        ],
        [{ row: 1, column: 1 }, { type: 'polyanets' }],
        [
          { row: 1, column: 2 },
          { type: 'comeths', direction: 'left' },
        ],
      ])
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1)
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        `map/1cc7fd20-d65d-4cb0-8041-1a41bc49a54f/goal`,
        MapGoalResponse
      )
    })

    it('fails with an invalid type in the map', async () => {
      httpServiceMock.get.mockResolvedValue({ goal: [['RATICULIN_UFO']] })

      await expect(megaverseService.getGoalMap()).rejects.toThrow(
        new Error('Unknown object of type UFO with property RATICULIN')
      )

      expect(httpServiceMock.get).toHaveBeenCalledTimes(1)
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        `map/1cc7fd20-d65d-4cb0-8041-1a41bc49a54f/goal`,
        MapGoalResponse
      )
    })
  })

  describe('sendMap', () => {
    it('generates a 0x0 map', async () => {
      await megaverseService.sendMap(new Map())

      expect(httpServiceMock.post).not.toHaveBeenCalled()
    })

    describe('[mutant] generates a 1x1 random map', () => {
      const times = 10

      for (let i = 0; i < times; i++) {
        it(`run #${i}`, async () => {
          const randomverse = getRandomverse({
            minRows: 1,
            maxRows: 1,
            minColumns: 1,
            maxColumns: 1,
          })
          httpServiceMock.get.mockResolvedValue({ goal: randomverse.goal })

          const goalMap = await megaverseService.getGoalMap()
          await megaverseService.sendMap(goalMap)

          expect(httpServiceMock.post).toHaveBeenCalledTimes(
            randomverse.apiCallsNeeded
          )

          let callNumber = 1
          for (const [, astralObject] of goalMap) {
            expect(httpServiceMock.post).toHaveBeenNthCalledWith(
              callNumber++,
              astralObject.type,
              {
                candidateId,
                row: astralObject.row,
                column: astralObject.column,
                color: (astralObject as Soloon).color,
                direction: (astralObject as Cometh).direction,
              }
            )
          }
        })
      }
    })

    describe('[mutant] generates a [10-100]x[10-100] random map', () => {
      const times = 10

      for (let i = 0; i < times; i++) {
        it(`run #${i}`, async () => {
          const randomverse = getRandomverse({
            minRows: 10,
            maxRows: 100,
            minColumns: 10,
            maxColumns: 100,
          })
          httpServiceMock.get.mockResolvedValue({ goal: randomverse.goal })

          const goalMap = await megaverseService.getGoalMap()
          await megaverseService.sendMap(goalMap)

          expect(httpServiceMock.post).toHaveBeenCalledTimes(
            randomverse.apiCallsNeeded
          )

          let callNumber = 1
          for (const [, astralObject] of goalMap) {
            expect(httpServiceMock.post).toHaveBeenNthCalledWith(
              callNumber++,
              astralObject.type,
              {
                candidateId,
                row: astralObject.row,
                column: astralObject.column,
                color: (astralObject as Soloon).color,
                direction: (astralObject as Cometh).direction,
              }
            )
          }
        })
      }
    })
  })
})
