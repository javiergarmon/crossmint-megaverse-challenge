import {
  type AstralObject,
  Cometh,
  MapGoalResponse,
  Polyanet,
  Soloon,
} from '../models'
import {
  type Coordinate,
  type RawMap,
  RawAstralObjectType,
  ComethDirection,
  SoloonColor,
} from '../types'
import { configService, httpService, loggerService } from '.'

/**
 * MegaverseService communicates with the server.
 * It uses Map objects as the representation of the goal map. This Map only has defined
 * Polyanets, Soloons and Comeths. Spaces are ignored because they don't need to be represented.
 */
export class MegaverseService {
  /**
   * Retrieves from the serve a Map with the goal map.
   * @async
   * @returns Promise<Map<Coordinate, AstralObject>>
   */
  async getGoalMap(): Promise<Map<Coordinate, AstralObject>> {
    const data = await httpService.get<MapGoalResponse>(
      `map/${configService.candidateId}/goal`,
      MapGoalResponse
    )
    return this.rawMapToGoalMap(data.goal)
  }

  /**
   * Calls to the server as many times as needed to recreate the goal map provided
   * @async
   * @param goalMap
   * @returns Promise<void>
   */
  async sendMap(goalMap: Map<Coordinate, AstralObject>): Promise<void> {
    let counter = 0
    const total = goalMap.size

    for (const [, astralObject] of goalMap) {
      loggerService.debug(
        `[MegaverseService] sendMap - creating object ${++counter} of ${total}`
      )
      await astralObject.create()
    }
  }

  /**
   * Transforms a 2D representation of the goal map into a Map object of it
   * @param data
   * @returns Map<Coordinate, AstralObject>
   */
  private rawMapToGoalMap(data: RawMap): Map<Coordinate, AstralObject> {
    const result = new Map<Coordinate, AstralObject>()

    for (let row = 0; row < data.length; row++) {
      for (let column = 0; column < data[row].length; column++) {
        const value = data[row][column]
        const [type, property] = value.split('_').reverse()

        if (type === RawAstralObjectType.SPACE) {
          continue
        }

        const coords: Coordinate = { column, row }

        if (type === RawAstralObjectType.POLYANET) {
          result.set(coords, new Polyanet(coords))
        } else if (type === RawAstralObjectType.COMETH) {
          result.set(
            coords,
            new Cometh({ ...coords, direction: ComethDirection[property] })
          )
        } else if (type === RawAstralObjectType.SOLOON) {
          result.set(
            coords,
            new Soloon({ ...coords, color: SoloonColor[property] })
          )
        } else {
          throw new Error(
            `Unknown object of type ${type} with property ${property}`
          )
        }
      }
    }

    return result
  }
}

export const megaverseService = new MegaverseService()
