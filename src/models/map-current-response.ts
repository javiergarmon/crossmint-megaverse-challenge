import { Type } from 'class-transformer'
import { IsDefined, ValidateNested } from 'class-validator'

class MapCurrentResponseMap {
  content: any
}

export class MapCurrentResponse {
  @IsDefined()
  @ValidateNested()
  @Type(() => MapCurrentResponseMap)
  map: MapCurrentResponseMap
}
