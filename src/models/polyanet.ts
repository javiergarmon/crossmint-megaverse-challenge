import { AstralObjectType, type Coordinate } from '../types'
import { AstralObject } from '.'

export class Polyanet extends AstralObject {
  constructor(input: Coordinate) {
    super({ ...input, type: AstralObjectType.POLYANET })
  }
}
