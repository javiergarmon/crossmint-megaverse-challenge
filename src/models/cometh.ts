import {
  AstralObjectType,
  type ComethDirection,
  type Coordinate,
} from '../types'
import { AstralObject } from '.'

export class Cometh extends AstralObject {
  direction: ComethDirection

  constructor(input: Coordinate & { direction: ComethDirection }) {
    super({ ...input, type: AstralObjectType.COMETH })
    this.direction = input.direction
  }

  async create(): Promise<void> {
    await super.create({ direction: this.direction })
  }
}
