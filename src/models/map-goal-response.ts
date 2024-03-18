import { RawMap } from '../types'
import { IsRawMap } from '../decorators'

export class MapGoalResponse {
  @IsRawMap()
  goal: RawMap
}
